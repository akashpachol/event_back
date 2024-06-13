const nodemailer = require('nodemailer')






const transporter = nodemailer.createTransport({
  
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'pigabo40@gmail.com',
    pass: 'wvcv tpuo eqzo ghle',
  },
});

 export const sendVerifyMail = async (email:string,otp:string) => {
    try {
      const mailOptions = {
        from: 'pigabo40@gmail.com',
        to: email,
        subject: 'For verification purpose',
        html: `<p>Hello , please enter this OTP: <strong>${otp}</strong> to verify your email.</p>`,
      };

       const information=await  transporter.sendMail( mailOptions);

       return true
 
    } catch (error) {
      console.log(error);
    }
   
  };


  export const sendPassword = async (email:string,password:string) => {
    try {
      const mailOptions = {
        from: 'pigabo40@gmail.com',
        to: email,
        subject: 'For verification purpose',
        html: `<p>Hello , your password is : <strong>${password}</strong> .</p>`,
      };

       const information=await  transporter.sendMail( mailOptions);

       return true
 
    } catch (error) {
      console.log(error);
    }
   
  };
  

  
  
   