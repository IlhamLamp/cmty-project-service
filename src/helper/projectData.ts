import { Project } from "../models";

export const InsertProjectData = (payload: Project, uuid: string) => {
  return [
    uuid,
    payload.user_id,
    payload.logo,
    payload.owner,
    payload.title,
    payload.company,
    new Date(payload.start_date).toISOString().split("T")[0],
    new Date(payload.end_date).toISOString().split("T")[0],
    payload.types,
    payload.duration,
    payload.participation,
    payload.address_city,
    payload.address_state,
    payload.address_zip_code,
    payload.address_street,
    payload.approval,
    payload.description,
    payload.salary,
    payload.priority,
    payload.status,
  ];
};

export const FiltersProjectData = (filters: Partial<Project>) => {
  return {
    ...(filters.types && { types: filters.types }),
    ...(filters.duration && { duration: filters.duration }),
    ...(filters.participation && {
      participation: filters.participation,
    }),
    ...(filters.priority && { priority: filters.priority }),
    ...(filters.status && { status: filters.status }),
    ...(filters.address_city && {
      address_city: filters.address_city,
    }),
    // ...(filters.tags && { tags: (filters.tags as string).split(",") }),
  };
};
