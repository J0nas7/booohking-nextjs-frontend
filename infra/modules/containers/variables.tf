variable "container_name" {
  type = string
}
variable "registry_image" {
  type = string
}
variable "namespace_id" {
  type = string
}

variable "min_scale" {
  type    = number
  default = 0
}

variable "max_scale" {
  type    = number
  default = 5
}

variable "memory_limit" {
  type    = number
  default = 256
}

variable "cpu_limit" {
  type    = number
  default = 140
}
