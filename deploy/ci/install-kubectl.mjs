// Installs a checksum-verified kubectl into .ci-bin for the deploy job (runners are linux/amd64).
// Version matches the K3s control plane (v1.34.6+k3s1).
import { createHash } from "node:crypto"
import { chmod, mkdir, writeFile } from "node:fs/promises"
import { arch } from "node:process"
import { rootCertificates } from "node:tls"

const version = "v1.34.6"
// https://dl.k8s.io/release/v1.34.6/bin/linux/amd64/kubectl.sha256
const sha256 = "3166155b17198c0af34ff5a360bd4d9d58db98bafadc6f3c2a57ae560563cd6b"

if (arch !== "x64") throw new Error(`Unsupported runner architecture: ${arch} (expected x64)`)

const response = await fetch(`https://dl.k8s.io/release/${version}/bin/linux/amd64/kubectl`)
if (!response.ok) throw new Error(`kubectl download failed: HTTP ${response.status}`)

const bytes = Buffer.from(await response.arrayBuffer())
const actual = createHash("sha256").update(bytes).digest("hex")
if (actual !== sha256) throw new Error(`kubectl checksum mismatch: ${actual}`)

await mkdir(".ci-bin", { recursive: true })
await writeFile(".ci-bin/kubectl", bytes)
await chmod(".ci-bin/kubectl", 0o755)
// The slim Node image has no system CA bundle, so kubectl (Go) cannot verify the GitLab agent
// proxy. Export Node's bundled Mozilla roots for it; the job sets SSL_CERT_FILE to this file.
await writeFile(".ci-bin/ca-certificates.pem", rootCertificates.join("\n") + "\n")
console.log(`Installed kubectl ${version} (linux/amd64) and ${rootCertificates.length} CA roots`)
