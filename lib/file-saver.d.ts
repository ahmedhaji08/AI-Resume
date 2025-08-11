declare module "file-saver" {
  export function saveAs(data: Blob, filename?: string, options?: { autoBom?: boolean }): void
  export function saveAs(data: File, filename?: string, options?: { autoBom?: boolean }): void
  export function saveAs(url: string, filename?: string, options?: { autoBom?: boolean }): void
}
