terraform {
  required_version = ">= 0.9.8"
  backend "s3" {
    bucket = "kr.sideeffect.terraform.state"
    key = "sideeffect-labmdas/terraform.tfstate"
    region = "ap-northeast-1"
    encrypt = true
    lock_table = "SideEffectTerraformStateLock"
    acl = "bucket-owner-full-control"
  }
}
