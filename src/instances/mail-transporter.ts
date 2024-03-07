//
// Imports
//

import nodemailer from "nodemailer";

import { configuration } from "./configuration.js";

//
// Mail Transporter
//

export const mailTransporter = nodemailer.createTransport(
	{
		host: configuration.smtpConfiguration.host,
		port: configuration.smtpConfiguration.port,
		secure: configuration.smtpConfiguration.port == 465,
		auth:
			{
				user: configuration.smtpConfiguration.username,
				pass: configuration.smtpConfiguration.password,
			},
	});