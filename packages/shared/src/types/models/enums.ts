/** 侧边栏数据 */
export enum RootsQueryKey {
  public = "publicRrRoots",
  private = "rrRoots",
}

export enum RrRootStatus {
  active = "active",
  archived = "archived",
}

export enum RrNodeStatus {
  Completed = "completed",
  Deprecated = "deprecated",
  InProgress = "in-progress",
  NotStarted = "not-started",
  Blocked = "blocked",
  Review = "review",
  Cancelled = "cancelled",
  Active = "active",
}
