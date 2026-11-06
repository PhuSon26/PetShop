provider "aws" {
  region = "us-east-1"
}

resource "aws_security_group" "allow_all" {
  name        = "allow_all_traffic"
  description = "Security group that allows all inbound and outbound traffic"

  ingress {
    description = "Allow all inbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "my_ec2_instance" {
  ami                    = "ami-02a9cdd4e98bc3c78"
  instance_type          = "t3.small"
  key_name               = "petshop-keypair"
  vpc_security_group_ids = [aws_security_group.allow_all.id]

  root_block_device {
    volume_size = 30
  }

  tags = {
    Name = "MyUbuntuInstance"
  }
}

resource "aws_instance" "my_ec2_instance1" {
  ami             = "ami-02a9cdd4e98bc3c78"
  instance_type   = "t3.small"
  key_name        = "petshop-keypair"
  security_groups = [aws_security_group.allow_all.name]

  root_block_device {
    volume_size = 8
  }

  tags = {
    Name = "k8s-master"
  }
}

resource "aws_instance" "my_ec2_instance2" {
  ami             = "ami-02a9cdd4e98bc3c78"
  instance_type   = "t3.small"
  key_name        = "petshop-keypair"
  security_groups = [aws_security_group.allow_all.name]

  root_block_device {
    volume_size = 8
  }

  tags = {
    Name = "k8s-slave"
  }
}