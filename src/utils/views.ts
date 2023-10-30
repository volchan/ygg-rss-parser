class ViewsPathBuilder {
  basePath: string

  constructor(basePath: string) {
    this.basePath = basePath.trim().replace(/\/$/, '')
  }

  build(path: string): string {
    return `${this.basePath}${path}`
  }
}

export { ViewsPathBuilder }
