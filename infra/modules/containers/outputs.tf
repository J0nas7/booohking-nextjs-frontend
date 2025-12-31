output "container_url" {
  description = "Public URL of the Next.js container"
  value       = scaleway_container.nextjs_app.domain_name
}

output "container_id" { value = scaleway_container.nextjs_app.id }
output "image_tag" { value = scaleway_container.nextjs_app.registry_image }
