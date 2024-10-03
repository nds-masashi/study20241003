#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MasashiStack } from '../lib/masashi-stack';

const app = new cdk.App();
new MasashiStack(app, 'MasashiStack');
