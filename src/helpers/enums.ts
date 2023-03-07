export enum Status {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  DELETED = "Deleted",
  EXPIRED = "Expired",
}

export enum AddressType {
  USER_ADDRESS = "CUSTOMER_ADDRESS",
  SERVICE_ADDRES = "SERVICE_ADDRESS",
  DROP_OFF_ADDRES = "DROP_OFF_ADDRES",
  DELIVERY_ADDRESS = "DELIVERY_ADDRESS",
}

export enum OrderStatus {
  CREATED = "Created",
  PREPARING = "Preparing",
  REJECTED = "Rejected",
  CANCELLED = "Cancelled",
  PROCESSING = "Processing",
  DELIVERED = "Delivered",
  COMPLETED = "Completed",
}

export enum OrderChefStatus {
  RECIEVED = "Recieved",
  PREPARING = "Preparing",
  REJECTED = "Rejected",
  READY = "Ready",
  COMPLETED = "Completed",
}

export enum OrderDeliveryStatus {
  RECIEVED = "Recieved",
  REJECTED = "Rejected",
  ACCEPTED = "Accepted",
  READY_TO_PICK = "Ready to pick",
  COLLECTED = "Collected",
  READY_TO_DROP = "Ready to drop",
  COMPLETED = "Completed",
}

export enum UserType {
  CUSTOMER = "Customer",
  CHEF = "Chef",
  DELIVERY_PARTNER = "Deliver Partner",
  SUPER_ADMIN = "Super Admin"
}
