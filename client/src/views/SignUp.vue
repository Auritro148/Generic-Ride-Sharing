```vue
<template>
  <div class="signup-page">

    <!-- Background overlay -->
    <div class="page-overlay"></div>


    <!--NAVBAR-->

    <nav class="navbar">

      <!-- Logo -->
      <div class="logo">

        <div class="logo-icon">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span class="logo-text">
          Rooda
        </span>

      </div>


      <!-- Home -->
      <button
        type="button"
        class="home-btn"
        @click="goHome"
      >
        Home
      </button>

    </nav>



    <!--SIGN UP WRAPPER-->

    <main class="signup-wrapper">

      <div class="signup-card">


        <!-- 
             STEP 1
         -->

        <div v-if="step === 1">

          <div class="signup-header">

            <span class="step-label">
              STEP 1 OF 3
            </span>

            <h1>
              Create account
            </h1>

            <p>
              Let's start with your name.
            </p>

          </div>


          <form @submit.prevent="handleStepOne">


            <!-- First Name -->

            <div class="input-group">

              <label for="firstName">
                First Name
              </label>

              <input
                id="firstName"
                v-model="form.first_name"
                type="text"
                placeholder="Enter your first name"
                autocomplete="given-name"
                required
              />

            </div>


            <!-- Last Name -->

            <div class="input-group">

              <label for="lastName">
                Last Name
              </label>

              <input
                id="lastName"
                v-model="form.last_name"
                type="text"
                placeholder="Enter your last name"
                autocomplete="family-name"
                required
              />

            </div>


            <!-- Error -->

            <p
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </p>


            <!-- Continue -->

            <button
              type="submit"
              class="signup-btn"
            >

              <span>
                Continue
              </span>

              <span class="arrow-circle">
                →
              </span>

            </button>

          </form>

        </div>



        <!-- 
             STEP 2
         -->

        <div v-if="step === 2">

          <div class="signup-header">

            <span class="step-label">
              STEP 2 OF 3
            </span>

            <h1>
              Your details
            </h1>

            <p>
              Add your contact information and create a password.
            </p>

          </div>


          <form @submit.prevent="handleRegistration">


            <!-- Phone -->

            <div class="input-group">

              <label for="phone">
                Phone Number
              </label>

              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="Enter your phone number"
                autocomplete="tel"
                required
              />

            </div>


            <!-- Email -->

            <div class="input-group">

              <label for="email">
                Email
              </label>

              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                required
              />

            </div>


            <!-- Password -->

            <div class="input-group">

              <label for="password">
                Password
              </label>

              <div class="password-wrapper">

                <input
                  id="password"
                  v-model="form.password"
                  :type="
                    showPassword
                      ? 'text'
                      : 'password'
                  "
                  placeholder="Create your password"
                  autocomplete="new-password"
                  required
                />

                <button
                  type="button"
                  class="show-password"
                  @click="
                    showPassword = !showPassword
                  "
                >

                  {{
                    showPassword
                      ? 'Hide'
                      : 'Show'
                  }}

                </button>

              </div>

            </div>


            <!-- Confirm Password -->

            <div class="input-group">

              <label for="confirmPassword">
                Confirm Password
              </label>

              <div class="password-wrapper">

                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  "
                  placeholder="Confirm your password"
                  autocomplete="new-password"
                  required
                />

                <button
                  type="button"
                  class="show-password"
                  @click="
                    showConfirmPassword =
                      !showConfirmPassword
                  "
                >

                  {{
                    showConfirmPassword
                      ? 'Hide'
                      : 'Show'
                  }}

                </button>

              </div>

            </div>


            <!-- Password requirements -->

            <div class="password-rules">

              <div
                :class="{
                  valid: hasMinLength
                }"
              >

                <span>
                  {{ hasMinLength ? '✓' : '○' }}
                </span>

                At least 6 characters

              </div>


              <div
                :class="{
                  valid: hasCapital
                }"
              >

                <span>
                  {{ hasCapital ? '✓' : '○' }}
                </span>

                At least one capital letter

              </div>


              <div
                :class="{
                  valid: hasSpecial
                }"
              >

                <span>
                  {{ hasSpecial ? '✓' : '○' }}
                </span>

                At least one special character

              </div>


              <div
                :class="{
                  valid: passwordsMatch
                }"
              >

                <span>
                  {{ passwordsMatch ? '✓' : '○' }}
                </span>

                Passwords match

              </div>

            </div>


            <!-- Error -->

            <p
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </p>


            <!-- Register -->

            <button
              type="submit"
              class="signup-btn"
              :disabled="loading"
            >

              <span>

                {{
                  loading
                    ? 'Creating account...'
                    : 'Create Account'
                }}

              </span>

              <span class="arrow-circle">
                →
              </span>

            </button>

          </form>


          <!-- Back -->

          <button
            type="button"
            class="back-btn"
            @click="goBackToStepOne"
          >
            ← Back
          </button>

        </div>



        <!-- 
             STEP 3
         -->

        <div v-if="step === 3">

          <div class="signup-header">

            <span class="step-label">
              STEP 3 OF 3
            </span>

            <h1>
              Verify email
            </h1>

            <p>
              We've sent a verification code to
              <strong>
                {{ form.email }}
              </strong>
            </p>

          </div>


          <form @submit.prevent="verifyOTP">


            <!-- OTP -->

            <div class="input-group">

              <label for="otp">
                Verification Code
              </label>

              <input
                id="otp"
                v-model="otp"
                type="text"
                inputmode="numeric"
                maxlength="6"
                placeholder="Enter 6-digit OTP"
                autocomplete="one-time-code"
                required
              />

            </div>


            <!-- Error -->

            <p
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </p>


            <!-- Success -->

            <p
              v-if="successMessage"
              class="success-message"
            >
              {{ successMessage }}
            </p>


            <!-- Verify -->

            <button
              type="submit"
              class="signup-btn"
              :disabled="otpLoading"
            >

              <span>

                {{
                  loading
                    ? 'Verifying...'
                    : 'Verify Email'
                }}

              </span>

              <span class="arrow-circle">
                →
              </span>
              {{ otpLoading ? "Verifying..." : "Verify" }}
            </button>

          </form>


          <!-- OTP footer -->

          <div class="otp-footer">

            <button
              type="button"
              class="resend-btn"
              @click="resendOTP"
              :disabled="loading"
            >
              Resend OTP
            </button>


            <button
              type="button"
              class="back-btn"
              @click="goBackToStepTwo"
            >
              ← Back
            </button>

          </div>

        </div>



        <!-- 
             LOGIN PROMPT
         -->

        <div
          v-if="step !== 3"
          class="login-prompt"
        >

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            @click="goToSignIn"
          >
            Sign In
          </button>

        </div>


      </div>

    </main>

  </div>
</template>



<script setup>

import {
  computed,
  reactive,
  ref
} from 'vue'

import { useRouter } from 'vue-router'


const router = useRouter()
const otpLoading = ref(false);



// 
// API URL
// 

const API_URL =
  'http://localhost:5000'



// 
// STEP
// 

const step = ref(1)



// 
// REGISTRATION FORM
// 

const form = reactive({

  first_name: '',

  last_name: '',

  phone: '',

  email: '',

  password: ''

})



// 
// CONFIRM PASSWORD
// 

const confirmPassword =
  ref('')



// 
// OTP
// 

const otp = ref('')



// 
// UI STATES
// 

const loading =
  ref(false)

const errorMessage =
  ref('')

const successMessage =
  ref('')



// 
// PASSWORD VISIBILITY
// 

const showPassword =
  ref(false)

const showConfirmPassword =
  ref(false)



// 
// PASSWORD VALIDATION
// 

const hasMinLength =
  computed(() => {

    return (
      form.password.length >= 6
    )

  })


const hasCapital =
  computed(() => {

    return /[A-Z]/.test(
      form.password
    )

  })


const hasSpecial =
  computed(() => {

    return /[^A-Za-z0-9]/.test(
      form.password
    )

  })


const passwordsMatch =
  computed(() => {

    return (
      form.password.length > 0 &&
      form.password ===
      confirmPassword.value
    )

  })



// 
// STEP 1
// SAVE NAME
// 

const handleStepOne = () => {

  errorMessage.value = ''

  successMessage.value = ''


  // Trim values

  form.first_name =
    form.first_name.trim()

  form.last_name =
    form.last_name.trim()


  // Validation

  if (!form.first_name) {

    errorMessage.value =
      'Please enter your first name.'

    return

  }


  if (!form.last_name) {

    errorMessage.value =
      'Please enter your last name.'

    return

  }


  // Save to localStorage

  localStorage.setItem(
    'registration_first_name',
    form.first_name
  )

  localStorage.setItem(
    'registration_last_name',
    form.last_name
  )


  // Go to Step 2

  step.value = 2

}



// 
// STEP 2
// REGISTER USER
// 

const handleRegistration =
  async () => {

    errorMessage.value = ''

    successMessage.value = ''

    loading.value = true


    try {


      // -----------------------------------------------
      // Validate phone
      // -----------------------------------------------

      form.phone =
        form.phone.trim()


      if (!form.phone) {

        throw new Error(
          'Please enter your phone number.'
        )

      }



      // -----------------------------------------------
      // Validate email
      // -----------------------------------------------

      form.email =
        form.email
          .trim()
          .toLowerCase()


      if (!form.email) {

        throw new Error(
          'Please enter your email.'
        )

      }



      // -----------------------------------------------
      // Validate password
      // -----------------------------------------------

      if (!hasMinLength.value) {

        throw new Error(
          'Password must contain at least 6 characters.'
        )

      }


      if (!hasCapital.value) {

        throw new Error(
          'Password must contain at least one capital letter.'
        )

      }


      if (!hasSpecial.value) {

        throw new Error(
          'Password must contain at least one special character.'
        )

      }


      if (!passwordsMatch.value) {

        throw new Error(
          'Passwords do not match.'
        )

      }



      // -----------------------------------------------
      // Save phone + email
      // -----------------------------------------------

      localStorage.setItem(
        'registration_phone',
        form.phone
      )

      localStorage.setItem(
        'registration_email',
        form.email
      )



      // -----------------------------------------------
      // Get first/last name from localStorage
      // -----------------------------------------------

      const first_name =
        localStorage.getItem(
          'registration_first_name'
        )

      const last_name =
        localStorage.getItem(
          'registration_last_name'
        )


      if (
        !first_name ||
        !last_name
      ) {

        throw new Error(
          'Registration information is missing. Please start again.'
        )

      }



      // -----------------------------------------------
      // Final registration payload
      //
      // This matches your backend:
      //
      // first_name
      // last_name
      // phone
      // email
      // password
      // -----------------------------------------------

      const registrationData = {

        first_name,

        last_name,

        phone: form.phone,

        email: form.email,

        password: form.password

      }



      console.log(
        'Registration request:',
        {
          ...registrationData,
          password: '********'
        }
      )



      // -----------------------------------------------
      // Send to backend
      // -----------------------------------------------

      const response =
        await fetch(
          `${API_URL}/core/user/register`,
          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify(
                registrationData
              )

          }
        )



      // -----------------------------------------------
      // Parse response
      // -----------------------------------------------

      const data =
        await response.json()



      console.log(
        'Registration response:',
        data
      )



      // -----------------------------------------------
      // Backend error
      // -----------------------------------------------

      if (!response.ok) {

        if (
          data.uniqueUser === false
        ) {

          throw new Error(
            'An account with this email already exists.'
          )

        }


        throw new Error(
          data.message ||
          'Registration failed.'
        )

      }



      // -----------------------------------------------
      // Check registration status
      // -----------------------------------------------

      if (
        data.regStatus !==
        'success'
      ) {

        throw new Error(
          data.message ||
          'Registration failed.'
        )

      }



      // -----------------------------------------------
      // Registration successful
      // OTP has now been sent
      // -----------------------------------------------

      successMessage.value =
        'Registration successful! OTP has been sent to your email.'


      // Move to OTP page

      step.value = 3


    }

    catch (error) {

      console.error(
        'Registration error:',
        error
      )


      errorMessage.value =
        error.message ||
        'Something went wrong while registering.'

    }

    finally {

      loading.value = false

    }

  }



// 
// STEP 3
// VERIFY OTP
// 

const verifyOTP = async () => {
    const otpCode = otp.value.trim();

    // Validate OTP
    if (!/^\d{6}$/.test(otpCode)) {
        otpError.value = "Please enter a valid 6-digit verification code.";
        return;
    }

    otpLoading.value = true;
    otpError.value = "";
    otpSuccess.value = "";

    try {
        const response = await fetch(`${API_URL}/core/user/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: registrationEmail.value,
                otp: otpCode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            switch (data.message) {
                case "Invalid OTP":
                    otpError.value = "Invalid verification code.";
                    break;

                case "OTP has expired":
                    otpError.value = "This verification code has expired.";
                    break;

                case "OTP has already been used":
                    otpError.value = "This verification code has already been used.";
                    break;

                case "OTP not found":
                    otpError.value =
                        "Verification code not found. Please register again.";
                    break;

                default:
                    otpError.value =
                        data.message || "OTP verification failed.";
            }

            return;
        }

        if (data.verificationStatus === "success") {

            otpSuccess.value = "Email verified successfully!";

            // Registration is complete
            localStorage.removeItem("registrationEmail");
            localStorage.removeItem("registrationFirstName");
            localStorage.removeItem("registrationLastName");
            localStorage.removeItem("registrationPhone");

            // Small delay so user can see success message
            setTimeout(() => {
                router.push("/signin");
            }, 1000);
        }

    } catch (error) {

        console.error("OTP verification error:", error);

        otpError.value =
            "Unable to verify the code. Please try again.";

    } finally {
        otpLoading.value = false;
    }
};

// 
// RESEND OTP
// 
//
// IMPORTANT:
// Your current backend only shows registerUser(),
// which generates and sends an OTP during registration.
//
// Therefore this function assumes that you create:
//
// POST /core/register/resend-otp
//
// If you don't have this endpoint yet, remove the
// Resend OTP button/function for now.
// 

const resendOTP =
  async () => {

    errorMessage.value = ''

    successMessage.value = ''

    loading.value = true


    try {

      const email =
        localStorage.getItem(
          'registration_email'
        )


      if (!email) {

        throw new Error(
          'Email information is missing.'
        )

      }


      const response =
        await fetch(
          `${API_URL}/core/register/resend-otp`,
          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify({
                email
              })

          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to resend OTP.'
        )

      }


      successMessage.value =
        data.message ||
        'A new OTP has been sent to your email.'


    }

    catch (error) {

      console.error(
        'Resend OTP error:',
        error
      )


      errorMessage.value =
        error.message ||
        'Failed to resend OTP.'

    }

    finally {

      loading.value = false

    }

  }



// 
// BACK TO STEP 1
// 

const goBackToStepOne =
  () => {

    errorMessage.value = ''

    successMessage.value = ''

    step.value = 1

  }



// 
// BACK TO STEP 2
// 

const goBackToStepTwo =
  () => {

    errorMessage.value = ''

    successMessage.value = ''

    step.value = 2

  }



// 
// HOME
// 

const goHome = () => {

  router.push('/')

}



// 
// SIGN IN
// 

const goToSignIn = () => {

  router.push('/signin')

}

</script>



<style scoped>

/* 
   RESET
 */

:global(*) {

  box-sizing: border-box;

}


:global(html),
:global(body),
:global(#app) {

  margin: 0;

  padding: 0;

  width: 100%;

  min-height: 100%;

  overflow-x: hidden;

}



/* 
   PAGE
 */

.signup-page {

  position: relative;

  width: 100vw;

  min-height: 100vh;

  overflow: hidden;

  background-image:
    url('/images/hero.jpg');

  background-size: cover;

  background-position: center;

  background-repeat: no-repeat;

}



/* 
   OVERLAY
 */

.page-overlay {

  position: fixed;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.78),
      rgba(0, 0, 0, 0.60)
    );

  z-index: 1;

}



/* 
   NAVBAR
 */

.navbar {

  position: relative;

  width: 100%;

  height: 90px;

  padding: 0 5.5%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  z-index: 5;

}



/* 
   LOGO
 */

.logo {

  display: flex;

  align-items: center;

  gap: 10px;

  color: white;

}


.logo-text {

  font-size: 34px;

  font-weight: 700;

  letter-spacing: -1.5px;

}



/* 
   LOGO ICON
 */

.logo-icon {

  width: 34px;

  height: 34px;

  display: grid;

  grid-template-columns:
    15px 15px;

  grid-template-rows:
    15px 15px;

  gap: 4px;

}


.logo-icon span {

  width: 15px;

  height: 15px;

  background: #20df4f;

  border-radius: 50%;

}


.logo-icon span:nth-child(2) {

  border-radius:
    50% 50% 50% 0;

}


.logo-icon span:nth-child(3) {

  border-radius:
    50% 0 50% 50%;

}


.logo-icon span:nth-child(4) {

  border-radius:
    0 50% 50% 50%;

}



/* 
   HOME BUTTON
 */

.home-btn {

  padding:
    11px 21px;

  border:
    1px solid
    rgba(255, 255, 255, 0.7);

  border-radius: 25px;

  background: transparent;

  color: white;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  transition:
    0.25s ease;

}


.home-btn:hover {

  background: white;

  color: #111;

}



/* 
   WRAPPER
 */

.signup-wrapper {

  position: relative;

  z-index: 3;

  width: 100%;

  min-height:
    calc(100vh - 90px);

  display: flex;

  align-items: center;

  justify-content: center;

  padding:
    25px 20px 40px;

}



/* 
   CARD
 */

.signup-card {

  width: 100%;

  max-width: 470px;

  padding: 42px;

  border-radius: 24px;

  background:
    rgba(18, 18, 18, 0.82);

  border:
    1px solid
    rgba(255, 255, 255, 0.12);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);

  box-shadow:
    0 25px 70px
    rgba(0, 0, 0, 0.45);

}



/* 
   HEADER
 */

.signup-header {

  margin-bottom: 30px;

}


.step-label {

  display: block;

  margin-bottom: 12px;

  color: #20df4f;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 1.5px;

}


.signup-header h1 {

  margin:
    0 0 10px;

  color: white;

  font-size: 38px;

  font-weight: 600;

  letter-spacing: -1.5px;

}


.signup-header p {

  margin: 0;

  color:
    rgba(255, 255, 255, 0.62);

  font-size: 15px;

  line-height: 1.5;

}


.signup-header strong {

  color: white;

}



/* 
   INPUT GROUP
 */

.input-group {

  margin-bottom: 20px;

}


.input-group label {

  display: block;

  margin-bottom: 9px;

  color:
    rgba(255, 255, 255, 0.9);

  font-size: 14px;

  font-weight: 500;

}


.input-group input {

  width: 100%;

  height: 53px;

  padding:
    0 16px;

  border:
    1px solid
    rgba(255, 255, 255, 0.16);

  border-radius: 12px;

  outline: none;

  background:
    rgba(255, 255, 255, 0.07);

  color: white;

  font-size: 15px;

  transition:
    0.25s ease;

}


.input-group input::placeholder {

  color:
    rgba(255, 255, 255, 0.38);

}


.input-group input:focus {

  border-color:
    #20df4f;

  background:
    rgba(255, 255, 255, 0.09);

  box-shadow:
    0 0 0 3px
    rgba(32, 223, 79, 0.08);

}



/* 
   PASSWORD
 */

.password-wrapper {

  position: relative;

}


.password-wrapper input {

  padding-right: 70px;

}


.show-password {

  position: absolute;

  right: 14px;

  top: 50%;

  transform:
    translateY(-50%);

  border: none;

  background: transparent;

  color: #20df4f;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

}



/* 
   PASSWORD RULES
 */

.password-rules {

  margin:
    -2px 0 20px;

  display: flex;

  flex-direction: column;

  gap: 6px;

  color:
    rgba(255, 255, 255, 0.42);

  font-size: 12px;

}


.password-rules div {

  display: flex;

  align-items: center;

  gap: 8px;

}


.password-rules span {

  font-size: 14px;

}


.password-rules .valid {

  color: #20df4f;

}



/* 
   ERROR
 */

.error-message {

  margin:
    -2px 0 17px;

  color: #ff6b6b;

  font-size: 13px;

  line-height: 1.5;

}



/* 
   SUCCESS
 */

.success-message {

  margin:
    -2px 0 17px;

  color: #20df4f;

  font-size: 13px;

  line-height: 1.5;

}



/* 
   SIGNUP BUTTON
 */

.signup-btn {

  width: 100%;

  height: 62px;

  border: none;

  border-radius: 35px;

  background: #20df4f;

  color: #111;

  padding:
    7px 8px 7px 25px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  font-size: 17px;

  font-weight: 700;

  cursor: pointer;

  transition:
    0.3s ease;

}


.signup-btn:hover {

  transform:
    translateY(-2px);

  box-shadow:
    0 10px 30px
    rgba(32, 223, 79, 0.25);

}


.signup-btn:disabled {

  opacity: 0.55;

  cursor: not-allowed;

  transform: none;

}



/* 
   ARROW
 */

.arrow-circle {

  width: 48px;

  height: 48px;

  border-radius: 50%;

  background: #111;

  color: white;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 25px;

  transition:
    0.3s ease;

}


.signup-btn:hover
.arrow-circle {

  transform:
    translateX(3px);

}



/* 
   BACK BUTTON
 */

.back-btn {

  margin-top: 18px;

  padding: 0;

  border: none;

  background: transparent;

  color:
    rgba(255, 255, 255, 0.5);

  font-size: 13px;

  cursor: pointer;

}


.back-btn:hover {

  color: white;

}



/* 
   OTP FOOTER
 */

.otp-footer {

  margin-top: 20px;

  display: flex;

  align-items: center;

  justify-content: space-between;

}


.otp-footer .back-btn {

  margin-top: 0;

}


.resend-btn {

  border: none;

  background: transparent;

  color: #20df4f;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

}


.resend-btn:hover {

  text-decoration: underline;

}


.resend-btn:disabled {

  opacity: 0.5;

  cursor: not-allowed;

}



/* 
   LOGIN PROMPT
 */

.login-prompt {

  margin-top: 28px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

  color:
    rgba(255, 255, 255, 0.55);

  font-size: 14px;

}


.login-prompt button {

  border: none;

  background: transparent;

  color: #20df4f;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

}


.login-prompt button:hover {

  text-decoration: underline;

}



/* 
   MOBILE
 */

@media (max-width: 600px) {

  .navbar {

    height: 75px;

    padding:
      0 25px;

  }


  .logo-text {

    font-size: 27px;

  }


  .home-btn {

    padding:
      9px 15px;

    font-size: 13px;

  }


  .signup-wrapper {

    min-height:
      calc(100vh - 75px);

    padding:
      20px 18px 30px;

  }


  .signup-card {

    padding:
      30px 24px;

    border-radius: 20px;

  }


  .signup-header h1 {

    font-size: 32px;

  }


  .otp-footer {

    align-items:
      flex-start;

    flex-direction:
      column;

    gap: 12px;

  }

}

</style>
```
