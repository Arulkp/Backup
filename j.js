function otp(s){
      let OTP = ''; 
      for (let i = 0; i < 5; i++ ) { 
        OTP += Math.floor(Math.random() * 10); 
      } 

     console.log(OTP)
      return OTP; 
    }
    otp();