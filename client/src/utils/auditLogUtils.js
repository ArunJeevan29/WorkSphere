export function getActivityMessage(log) {
  switch (log.action) {
      case "TASK_CREATED":
        return "created a new task";

      case "TASK_UPDATED":
        return "updated a task";

      case "TASK_DELETED":
        return "deleted a task";

      case "TASK_STATUS_UPDATED":
        return "updated a task status";

    case "PROJECT_CREATED":
      return "created a new project";

    case "PROJECT_EDITED":
      return "edited a project";

    case "PROJECT_DELETED":
      return "deleted a project";

    case "PROJECT_MEMBERS_ADDED":
      return "added a member to the project";

    case "PROJECT_MEMBERS_REMOVED":
      return "removed a member from the project";

    case "USER_ROLE_UPDATED":
      return "updated user role";

    case "USER_STATUS_UPDATED":
      return "updated user status";

    default:
      return "performed an action";
  }
}

//For ProjectOverview file

export function formatActivity(log) {
  switch (log.action) {
    case "PROJECT_CREATED":
      return "created this project";

    case "PROJECT_UPDATED":
      return "updated this project";

    case "PROJECT_DELETED":
      return "deleted this project";

    case "PROJECT_MEMBERS_ADDED":
      return "added members to this project";

    case "PROJECT_MEMBERS_REMOVED":
      return "removed members from this project";

    case "TASK_CREATED":
      return `created task "${log.metadata?.title}"`;

    case "TASK_UPDATED":
      return `updated task "${log.metadata?.title}"`;

    case "TASK_DELETED":
      return `deleted task "${log.metadata?.title}"`;

    case "TASK_STATUS_UPDATED":
      return `updated task status to ${log.metadata?.status}`;

    default:
      return "performed an action";
  }
}

export function getRelativeTime(date) {
  const now = new Date();
  const created = new Date(date);
  const difference = Math.floor((now - created) / 1000);
  if (difference < 60) {
    return "Just now";
  }
  const minutes = Math.floor(difference / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
