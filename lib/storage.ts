import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface StorageConfig {
  endpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

export function newStorage(config?: StorageConfig) {
  return new Storage(config);
}

export class Storage {
  private s3: S3Client;
  private endpoint: string;

  constructor(config?: StorageConfig) {
    const endpoint = config?.endpoint || process.env.STORAGE_ENDPOINT || "";
    this.endpoint = endpoint;
    this.s3 = new S3Client({
      endpoint: endpoint || undefined,
      region: config?.region || process.env.STORAGE_REGION || "auto",
      credentials: {
        accessKeyId: config?.accessKey || process.env.STORAGE_ACCESS_KEY || "",
        secretAccessKey:
          config?.secretKey || process.env.STORAGE_SECRET_KEY || "",
      },
    });
  }

  async uploadFile({
    body,
    key,
    contentType,
    bucket,
    disposition = "inline",
  }: {
    body: Uint8Array | ArrayBuffer | Blob | string;
    key: string;
    contentType?: string;
    bucket?: string;
    disposition?: "inline" | "attachment";
  }) {
    if (!bucket) {
      bucket = process.env.STORAGE_BUCKET || "";
    }

    if (!bucket) {
      throw new Error("Bucket is required");
    }

    const normalizedBody =
      body instanceof ArrayBuffer ? new Uint8Array(body) : body;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: normalizedBody,
        ContentDisposition: disposition,
        ...(contentType && { ContentType: contentType }),
      })
    );

    const location = this.buildObjectUrl(bucket, key);
    const url = this.buildPublicUrl(key, location);

    return {
      location,
      bucket,
      key,
      filename: key.split("/").pop(),
      url,
    };
  }

  async downloadAndUpload({
    url,
    key,
    bucket,
    contentType,
    disposition = "inline",
  }: {
    url: string;
    key: string;
    bucket?: string;
    contentType?: string;
    disposition?: "inline" | "attachment";
  }) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("No body in response");
    }

    const arrayBuffer = await response.arrayBuffer();
    return this.uploadFile({
      body: arrayBuffer,
      key,
      bucket,
      contentType,
      disposition,
    });
  }

  private buildObjectUrl(bucket: string, key: string) {
    if (process.env.STORAGE_DOMAIN) {
      return joinUrl(process.env.STORAGE_DOMAIN, key);
    }

    if (this.endpoint) {
      return joinUrl(this.endpoint, `${bucket}/${key}`);
    }

    return joinUrl(`https://${bucket}.s3.amazonaws.com`, key);
  }

  private buildPublicUrl(key: string, fallback: string) {
    if (process.env.STORAGE_DOMAIN) {
      return joinUrl(process.env.STORAGE_DOMAIN, key);
    }

    return fallback;
  }
}

function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\//, "");
  return `${normalizedBase}/${normalizedPath}`;
}
