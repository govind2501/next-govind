    import { connect } from "@/dbConfig/dbConfig";
    
    import userModels from "@/models/userModels";
    import { NextRequest, NextResponse } from "next/server";
    import bcryptjs from "bcryptjs";
    import { sendEmail } from "@/utils/mailHelpers"
 
    
    export async function POST(request: NextRequest){
      try {
      await connect();
      const reqBody = await request.json();
      const {username, email, password} = reqBody;

      if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

      // validation
      console.log(reqBody);

      const user = await userModels.findOne({email});
      if (user) {
        return NextResponse.json(
          {error: "User already exists"},
          {status: 400}
          );
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      
      const newUser = new userModels({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      console.log(savedUser);

      //send verification email
      await sendEmail({
        email, 
        emailType: "VERIFY", 
        userId: savedUser._id})

      return NextResponse.json({
        message: "User registered successfully",
        success: true,
        savedUser,
      });

      } catch (error: any) {
         console.log("Signup route error:", error.message);
       return NextResponse.json(
        { error: error.message }, 
        {status: 500}
      );
  }
}