#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TomitaStack } from '../lib/tomita-stack';

const app = new cdk.App();

const env = {
    account: '678830113226',
    region: 'ap-northeast-1',
}

const stack = new TomitaStack(app, 'TomitaStack', {
    env,
});

cdk.Tags.of(stack).add("Name", "TomitaStack");
cdk.Tags.of(stack).add("Createdby", "tomita");