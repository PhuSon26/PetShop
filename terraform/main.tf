provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "allow_all" {
  name = "allow_all_traffic"
  description = "Security group that allows all inbound and outbound traffic"

  ingress = {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress = {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "my_ec2_instance" {
  ami = "ami-0f58b397bc5c1f2e8"
  instance_type = "t2.large"
  key_name = "my-keypair"
  security_groups = [aws_security_group.allow_all.name]

  root_block_device {
    volume_size = 30
  }

  tags = {
    Name = "MyUbuntuInstance"
  }
}

resource "aws_instance" "k8s-master" {
  ami = "ami-0f58b397bc5c1f2e8"
  instance_type = "t2.large"
  key_name = "my-keypair"
  security_groups = [aws_security_group.allow_all.name]

  root_block_device {
    volume_size = 30
  }

  tags = {
    Name = "MyUbuntuInstance"
  }
}

resource "aws_instance" "my_ec2_instance" {
  ami = "ami-0f58b397bc5c1f2e8"
  instance_type = "t2.large"
  key_name = "my-keypair"
  security_groups = [aws_security_group.allow_all.name]

  root_block_device {
    volume_size = 30
  }

  tags = {
    Name = "MyUbuntuInstance"
  }
}