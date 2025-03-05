import {
  sendMailToManager,
  sendMailToVender,
} from "../framework/database/mongodb/repositories/bookingRepositoryMongoDB";
import cron from "node-cron";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "pigabo40@gmail.com",
    pass: "wvcv tpuo eqzo ghle",
  },
});

export const sendVerifyMail = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: "pigabo40@gmail.com",
      to: email,
      subject: "For verification purpose",
      html: `<p>Hello , please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
    };

    const information = await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const sendPassword = async (email: string, password: string) => {
  try {
    const mailOptions = {
      from: "pigabo40@gmail.com",
      to: email,
      subject: "For verification purpose",
      html: `<p>Hello , your password is : <strong>${password}</strong> .</p>`,
    };

    const information = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendService = async (
  name: string | undefined,
  phone: string,
  email: string | undefined
) => {
  try {
    const mailOptions = {
      from: "pigabo40@gmail.com",
      to: email,
      subject: "For booking service",
      html: `<p>Hello,${name} IS BOOKED event, </p>
        <p>Phone number: <strong>${phone}</strong> .</p>
        `,
    };

    const information = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

export const sendManger = async () => {
  try {
    const bookingData: any = await sendMailToManager();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingData.length > 0) {
      for (const booking of bookingData) {
        if (booking.manager && booking.manager.email) {
          const mailOptions = {
            from: "pigabo40@gmail.com",
            to: booking.manager.email,
            subject: `Booking Summary for ${today.toDateString()}`,
            text: `Dear ${booking.manager.username},\n\nHere is the booking summary for today:\n Name:${booking.user.username}\nEvent: ${booking.event.name}\n...Date: ${booking.time}\nTime: ${booking.date}\n..`, // Customize the email content
          };

          await transporter.sendMail(mailOptions);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendVender = async () => {
  try {
    const venderData: any = await sendMailToVender();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (venderData.length > 0) {
      for (const vender of venderData) {
        if (vender.vender && vender.vender.email) {
          const mailOptions = {
            from: "pigabo40@gmail.com",
            to: vender.vender.email,
            subject: `Booking Summary for ${today.toDateString()}`,
            text: `Dear ${vender.vender.username},\n\nHere is the booking summary for today:...Date: ${vender.time}\nTime: ${vender.date}\n..`, // Customize the email content
          };

          await transporter.sendMail(mailOptions);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// cron.schedule("*/30 * * * * *", async () => {
//   await sendManger();
//   await sendVender();
// });
