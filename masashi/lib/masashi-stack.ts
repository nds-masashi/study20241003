import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class MasashiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
 
    // VPC の作成
    const vpc = new ec2.Vpc(this, 'MasashiVpc', {
      maxAzs: 3, // 可用性ゾーンの数
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet',
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          name: 'PrivateSubnet',
        },
      ],
    });

    // セキュリティグループの作成
    const securityGroup = new ec2.SecurityGroup(this, 'MasashiSecurityGroup', {
      vpc,
      description: 'Allow ssh and http access',
      allowAllOutbound: true   // 全てのアウトバウンドトラフィックを許可
    });

    // セキュリティグループのルールを設定
    securityGroup.addIngressRule(ec2.Peer.ipv4('118.238.231.215/32'), ec2.Port.tcp(22), 'Allow SSH access'); // SSH (ポート22)

    // EC2 キーペアの作成
    // AWS Systems Manager -> パラメタストアに秘密鍵は生成される
    const cfnKeyPair = new ec2.CfnKeyPair(this, 'CfnKeyPair', {
      keyName: 'keypair-masashi2',
    })
    //cfnKeyPair.applyRemovalPolicy(RemovalPolicy.DESTROY)
    const keyPair = ec2.KeyPair.fromKeyPairName(this, 'key-0fbbc56cbc237a07e', 'keypair-masashi');

    // EC2 インスタンスの作成
    new ec2.Instance(this, 'MasashiInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2(), // Amazon Linux 2 を使用
      vpc,
      securityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC, // パブリックサブネットに配置
      },
      associatePublicIpAddress: true, // パブリック IP アドレスを関連付ける
      //keyPair: keyPair,
      keyName: cfnKeyPair.ref,
    });
  }
}
