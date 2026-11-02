# manar.vax.sh deployment

> The addresses in this document (192.0.2.0/24) and the host `edge.example.com` are placeholders from
> documentation ranges. Substitute your own node and edge addresses.

```text
Internet
  -> Cloudflare (DNS manar.vax.sh proxied, SSL/TLS mode Full (strict))
  -> edge Nginx :443 on the edge VM (Let's Encrypt wildcard, Cloudflare/LAN-only peers, real IP restore, edge rate limit)
  -> K3s ServiceLB / Traefik on 192.0.2.46 / .32 / .138 :8080 (HTTP)
  -> Ingress manar.vax.sh (namespace manar-landing)
  -> Service manar-landing :80
  -> 2–4 Next.js pods :3000 (non-root, read-only root filesystem)
```

| Path | Contents |
| --- | --- |
| `Dockerfile` | Multi-stage build; Next.js standalone runtime on pinned `node:24.18.0-bookworm-slim`, uid 10001. Unit tests run during build. |
| `deploy/k8s/` | Operator kustomization: Namespace (PSS restricted), NetworkPolicies, Service, Ingress, plus `app/`. |
| `deploy/k8s/app/` | Application resources CI re-applies on each release: ServiceAccount, Deployment, PDB, HPA. |
| `.gitlab-ci.yml` | Validate every push; build, scan, and deploy every push to protected `main`. |
| `.gitlab/agents/manar-landing-production/` | GitLab agent authorization (this project, protected branches, `production` environment only). |
| `deploy/gitlab-agent/` | Agent namespace/ServiceAccount, Helm values, and the namespaced release Role. |
| `deploy/nginx/manar.conf` | Edge vhost → `/etc/nginx/conf.d/manar.conf`: upstream, origin allowlist, `limit_req_zone`, servers. |
| `deploy/nginx/snippets/` | `manar-proxy.conf`, `manar-security-headers.conf` → `/etc/nginx/snippets/`. |
| `deploy/nginx/apply-edge.sh` | Backup, install, `nginx -t`, reload, auto-restore on failure. |

## 1. Build and push the image

`SITE_URL` is baked into prerendered HTML (canonical, hreflang, structured data, Open Graph) and the
public `/robots.txt` and `/sitemap.xml` routes, so it is a build argument. Use `https://manar.vax.sh`.
Changing it at runtime requires a rebuild to update these URLs. After release, follow the
[search indexing checks](../README.md#search-indexing), including clearing any cached 404s for the two new routes.
All nodes are `amd64`.

```bash
TAG=$(date -u +%Y%m%d)-<short-sha>
docker buildx build --platform linux/amd64 --load \
  --build-arg SITE_URL=https://manar.vax.sh \
  --build-arg BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
  --build-arg VCS_REF=<git-sha> \
  --build-arg IMAGE_VERSION=$TAG \
  -t registry.gitlab.vax.sh/manar/landing:$TAG .
docker push registry.gitlab.vax.sh/manar/landing:$TAG
```

The GitLab project `manar/landing` must exist before the push (otherwise the registry answers `denied`).
After pushing, pin the digest in `deploy/k8s/app/kustomization.yaml` (first install only; afterwards CI owns it):

```yaml
images:
  - name: registry.gitlab.vax.sh/manar/landing
    digest: sha256:<digest printed by docker push>
```

Local smoke test with the production security posture:

```bash
docker run --rm -p 3300:3000 --read-only --tmpfs /tmp \
  --tmpfs /app/.next/cache:uid=10001,gid=10001 --cap-drop ALL \
  --security-opt no-new-privileges registry.gitlab.vax.sh/manar/landing:$TAG
curl -s localhost:3300/api/health
```

## 2. Cluster prerequisites (one time)

```bash
kubectl apply -f deploy/k8s/namespace.yaml

# Registry pull secret: use a GitLab deploy token with read_registry scope on manar/landing
# (or the manar group). Other namespaces' gitlab-registry tokens may not grant access to this project.
kubectl -n manar-landing create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.vax.sh \
  --docker-username='<deploy-token-username>' \
  --docker-password='<deploy-token>'

# Email for the demo form. The site runs without it, but the form then shows a failure message.
# Azure Communication Services connection string and a sender of its linked Email domain.
read -rs ACS_CONNECTION_STRING
kubectl -n manar-landing create secret generic manar-landing-email \
  --from-literal=acs-connection-string="$ACS_CONNECTION_STRING" \
  --from-literal=demo-from-email='noreply@your-verified-domain'
unset ACS_CONNECTION_STRING
```

## 3. First deploy (operator)

After this first install, releases come from GitLab CI (section 5). Re-running `kubectl apply -k deploy/k8s`
later would roll the Deployment back to the bootstrap digest; for infrastructure-only changes apply the
individual files instead (for example `kubectl apply -f deploy/k8s/network-policy.yaml`).

```bash
kubectl kustomize deploy/k8s | less          # review
kubectl apply --dry-run=server -k deploy/k8s # after the namespace exists
kubectl apply -k deploy/k8s
kubectl -n manar-landing rollout status deploy/manar-landing
kubectl -n manar-landing get pods -o wide
```

Pods spread across the three live nodes (`k3s-cp1`, `k3s-worker-1`, `k3s-worker-2`). `node-b` stays excluded until it
re-joins on the control plane's k3s version. `node-c` and `node-b` were removed from the cluster on 2026-09-19.
`nodeTaintsPolicy: Honor` keeps any future NotReady node from blocking scale-out.

Verify from inside the LAN before touching the edge:

```bash
curl -s -H 'Host: manar.vax.sh' http://192.0.2.46:8080/api/health
```

## 4. Edge Nginx (edge VM, 192.0.2.12)

The edge already has what this site needs:
- a Let's Encrypt certificate for `manar.vax.sh` and `*.manar.vax.sh` at `/etc/letsencrypt/live/manar.vax.sh/`
  (certbot, dns-cloudflare, auto-renewed by `certbot.timer`);
- `conf.d/00-cloudflare-real-ip.conf`, which restores the visitor IP from `CF-Connecting-IP` for Cloudflare peers.

`deploy/nginx/manar.conf` replaces the retired Manar console config (`manar.vax.sh`, `api.`, `auth.` pointing at the
App VM 192.0.2.109). It proxies `manar.vax.sh` to Traefik, drops non-Cloudflare/non-LAN peers with 444, and closes
every other `*.manar.vax.sh` name with 444. `apply-edge.sh` also removes the old agent mTLS passthrough
(`stream-conf.d/agents-mtls.conf`, port 3443).

Install (backs up, installs, tests, reloads, and restores automatically if `nginx -t` fails):

```bash
scp deploy/nginx/manar.conf deploy/nginx/snippets/manar-*.conf deploy/nginx/apply-edge.sh \
  deploy@edge.example.com:manar-edge/
ssh -t deploy@edge.example.com 'cd ~/manar-edge && sudo bash apply-edge.sh'
```

The router/firewall source-NATs the 80/443 port-forward, so nginx sees every inbound connection as coming from the
WAN address `94.59.105.209`, never from Cloudflare. `snippets/manar-realip.conf` and the `geo` block in `manar.conf`
trust that address so the visitor IP is restored from `CF-Connecting-IP`. Preserving the source address on the
port-forward is the proper fix (it would also give real visitor IPs to the other sites on this edge); after that,
remove `94.59.105.209` from both places.

Recommended once for all sites on this edge (certbot has no reload hook, so renewed certificates are not picked
up until nginx is reloaded):

```bash
ssh -t deploy@edge.example.com "printf '#!/bin/sh\nsystemctl reload nginx\n' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx >/dev/null && sudo chmod 755 /etc/letsencrypt/renewal-hooks/deploy/reload-nginx"
```

Cloudflare: `manar.vax.sh` proxied (orange cloud), SSL/TLS mode **Full (strict)**. Delete the DNS records of retired
hosts (`api.manar.vax.sh`, `auth.manar.vax.sh`, and the agents mTLS hostname if one exists).

Checks after go-live:

```bash
curl -sI https://manar.vax.sh/en | grep -iE 'HTTP/|cache-control|x-frame|strict-transport'
curl -s https://manar.vax.sh/api/health
curl -s -o /dev/null -w '%{http_code}\n' https://manar.vax.sh/api/demo-request   # 403 (POST only)
```

## Client IP and rate limiting

Traefik runs without `forwardedHeaders.trustedIPs`, so it replaces `X-Forwarded-For` / `X-Real-IP` with the
edge's address. The edge therefore sends the Cloudflare-verified visitor IP in `X-Edge-Client-IP`, which Traefik
passes through unchanged. The pod reads it via `TRUSTED_CLIENT_IP_HEADER=x-edge-client-ip`. This is only safe
because the NetworkPolicy admits traffic from Traefik alone and the edge always overwrites the header.

Two layers limit demo requests:
- Edge (shared across replicas): 5 requests/minute per visitor, burst 5 → HTTP 429.
- Pod (per replica, in memory): 5 requests per 10 minutes per visitor.

## Maintenance

- Cloudflare IP ranges appear in `manar.conf` (`geo`) and the edge's `conf.d/00-cloudflare-real-ip.conf`; refresh both from
  https://www.cloudflare.com/ips-v4 and /ips-v6.
- Upstream node list and node affinity reflect cluster state on 2026-09-17; update both when nodes change.
- Unknown locale paths (e.g. `/xx`) return 404 and Next logs an internal `NoFallbackError` line; it is harmless.

## 5. Continuous deployment (GitLab CI)

Every push to any branch runs lint, typecheck, unit tests, `npm audit`, and a Trivy secret/misconfiguration/
dependency scan. Every push to the protected default branch (`main`) additionally:

1. builds the image with rootless BuildKit and pushes `registry.gitlab.vax.sh/manar/landing:<commit-sha>`;
2. scans that exact digest (fails on fixed HIGH/CRITICAL) and stores a CycloneDX SBOM;
3. applies `deploy/k8s/app` (ServiceAccount, Deployment, PDB, HPA) with that digest through the GitLab agent, waits for the rollout, and checks the running
   pods use the new digest (plus an optional public smoke test).

A release is a zero-downtime rolling update, typically live a few minutes after the push. Other branches never deploy.
No kubeconfig or cluster credential is stored in GitLab: the agent connects out from the cluster.

### One-time setup

**Runners.** Jobs use the existing tags `stack-validation` (checks) and `stack-production` (build, scan, deploy).
Make both runners available to `manar/landing` (Settings → CI/CD → Runners), or register project runners with
those tags. The production runner must be protected and allow rootless BuildKit (`--oci-worker-no-process-sandbox`).

**Protect `main`.** Settings → Repository → Protected branches: allow merge/push to Maintainers only, no force push.
The deploy jobs only run when `CI_COMMIT_REF_PROTECTED` is true.

**Register the agent.** Commit `.gitlab/agents/manar-landing-production/config.yaml` to `main` first, then
Operate → Kubernetes clusters → Connect a cluster → select `manar-landing-production` and copy the token.

**Install the agent** (use the chart version matching your GitLab; the other agents on this cluster run agentk v19.3.0):

```bash
kubectl apply -f deploy/gitlab-agent/bootstrap.yaml

read -rsp 'GitLab agent token: ' GITLAB_AGENT_TOKEN; printf '\n'
printf '%s' "$GITLAB_AGENT_TOKEN" | kubectl -n gitlab-agent-manar-landing-production \
  create secret generic gitlab-agent-token --from-file=token=/dev/stdin
unset GITLAB_AGENT_TOKEN

helm repo add gitlab https://charts.gitlab.io && helm repo update
helm upgrade --install manar-landing-production gitlab/gitlab-agent \
  --version '<chart-version-matching-gitlab>' \
  --namespace gitlab-agent-manar-landing-production \
  --values deploy/gitlab-agent/values.yaml
```

**Grant release permissions** (after the first deploy in section 3, so the objects exist):

```bash
kubectl apply -f deploy/gitlab-agent/release-rbac.yaml

agent='system:serviceaccount:gitlab-agent-manar-landing-production:manar-landing-production-agent'
kubectl auth can-i patch deployment/manar-landing -n manar-landing --as="$agent"     # yes
kubectl auth can-i create deployments -n manar-landing --as="$agent"                # no
kubectl auth can-i get secret/manar-landing-email -n manar-landing --as="$agent"     # no
kubectl auth can-i patch networkpolicies -n manar-landing --as="$agent"              # no
kubectl auth can-i create pods/exec -n manar-landing --as="$agent"                   # no
```

**Resource group.** So a burst of pushes deploys the newest commit instead of queueing each one:

```bash
read -rsp 'GitLab API token (api scope): ' T; printf '\n'
curl --fail-with-body -X PUT -H "PRIVATE-TOKEN: $T" --data 'process_mode=newest_ready_first' \
  "https://gitlab.vax.sh/api/v4/projects/manar%2Flanding/resource_groups/manar-landing-production"
unset T
```

(Run it after the first `deploy-production` job has created the group.) Also enable Settings → CI/CD →
General pipelines → **Prevent outdated deployment jobs**.

**Optional project variables** (Settings → CI/CD → Variables, all *Protected*):

| Variable | Purpose |
| --- | --- |
| `PRODUCTION_SMOKE_URL` = `https://manar.vax.sh` | After rollout, require 200 from `/api/health`, `/en`, `/ar`, `/en/demo`, `/ar/demo`. Set once the edge and DNS are live. |
| `REGISTRY_DEPLOY_USER` / `REGISTRY_DEPLOY_PASSWORD` (masked) | A `read_registry` deploy token; the deploy job keeps the `gitlab-registry` pull secret in sync. |

### Rollback

Revert the commit and push to `main`; the pipeline builds, scans, and deploys the reverted source. In an
emergency an operator can `kubectl -n manar-landing rollout undo deploy/manar-landing`, then revert in Git so the
next push does not reintroduce the bad version.

### What CI does not change

Namespace, NetworkPolicies, Service, Ingress, the email secret, the agent itself, and the edge Nginx stay
operator-managed (the Service and Ingress decide where traffic goes, so the CI identity may not change them). The
release Role can only update the named application objects, read pods/ReplicaSets for rollout status, and update
the `gitlab-registry` pull secret.
