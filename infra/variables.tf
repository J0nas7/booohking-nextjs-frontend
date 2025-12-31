# Root module variables for GitHub Actions deployment

variable "container_name" {
  type        = string
  description = "Name of the Scaleway container"
}

variable "registry_image" {
  type        = string
  description = "Docker image to deploy"
}

variable "scaleway_access_key" {
  type        = string
  description = "Scaleway API access key"
  sensitive   = true
}

variable "scaleway_secret_key" {
  type        = string
  description = "Scaleway API secret key"
  sensitive   = true
}

variable "scaleway_project_id" {
  type        = string
  description = "Scaleway project ID"
}

variable "region" {
  type        = string
  description = "Scaleway region"
  default     = "fr-par"
}

variable "namespace_name" {
  type        = string
  description = "Scaleway container namespace name"
}
