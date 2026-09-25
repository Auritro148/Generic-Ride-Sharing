<template>
  <div class="home-page">

    <!-- ================= NAVBAR ================= -->
    <nav class="navbar">

      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <!-- Rename your app here -->
        <span class="logo-text">Rooda</span>
      </div>


      <!-- Navigation Links -->
      <div class="nav-links">
        <a href="#">Home</a>
        <a href="#">About us</a>
        <a href="#">Why Rooda</a>
        <a href="#">Blog</a>
        <a href="#">Vehicles</a>
      </div>


      <!-- Authentication Buttons -->
      <div class="auth-buttons">

  <button
    type="button"
    class="sign-in-btn"
    @click="handleSignIn"
  >
    Sign In
  </button>

  <button
    type="button"
    class="sign-up-btn"
    @click="handleSignUp"
  >
    Sign Up
  </button>

</div>
    </nav>


    <!-- ================= HERO SECTION ================= -->
    <section class="hero">

      <!--
        ================================================
        BACKGROUND IMAGE
        ================================================

        Put your image here:

        public/
          images/
            hero.jpg

        Then use:

        background-image: url('/images/hero.jpg');

        ================================================
      -->

      <div class="hero-overlay"></div>


      <!-- Hero Content -->
      <div class="hero-content">

        <h1>
          Move Smarter<br />
          with Rooda
        </h1>


        <button class="get-started-btn"
        type="button"
    
    @click="handleSignIn">

          <span>Sign in</span>

          <span class="arrow-circle">
            →
          </span>

        </button>

      </div>

    </section>

  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleSignIn = () => {
  router.push('/signin')
}

const handleSignUp = () => {
  router.push('/driversignin')
}
</script>


<style scoped>

/* =========================================
   RESET
   Removes browser default white space
========================================= */

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


/* =========================================
   PAGE
========================================= */

/* =========================================
   PAGE - FULL SCREEN BACKGROUND
========================================= */

.home-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;

  margin: 0;
  padding: 0;

  overflow: hidden;

  position: relative;

  /*image*/
  background-image: url('D:\ACADEMIC_Level 2 term 1\Generic-Ride-Sharing\client\src\components\home.jpg');

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* =========================================
   NAVBAR
========================================= */

.navbar {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;

  height: 90px;

  padding: 0 5.5%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  z-index: 10;
}


/* =========================================
   LOGO
========================================= */

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


/* Green logo */

.logo-icon {
  width: 34px;
  height: 34px;

  position: relative;

  display: grid;

  grid-template-columns: 15px 15px;
  grid-template-rows: 15px 15px;

  gap: 4px;
}

.logo-icon span {
  display: block;

  width: 15px;
  height: 15px;

  background: #20df4f;

  border-radius: 50%;
}

.logo-icon span:nth-child(2) {
  border-radius: 50% 50% 50% 0;
}

.logo-icon span:nth-child(3) {
  border-radius: 50% 0 50% 50%;
}

.logo-icon span:nth-child(4) {
  border-radius: 0 50% 50% 50%;
}


/* =========================================
   NAV LINKS
========================================= */

.nav-links {
  display: flex;
  align-items: center;

  gap: 38px;
}

.nav-links a {
  color: white;

  text-decoration: none;

  font-size: 16px;

  font-weight: 500;

  transition: 0.25s ease;
}

.nav-links a:hover {
  color: #20df4f;
}


/* =========================================
   AUTH BUTTONS
========================================= */

.auth-buttons {
  display: flex;
  align-items: center;

  gap: 12px;
}


/* Sign In */

.sign-in-btn {
  border: 1px solid rgba(255, 255, 255, 0.7);

  background: transparent;

  color: white;

  padding: 12px 23px;

  border-radius: 28px;

  font-size: 15px;

  font-weight: 600;

  cursor: pointer;

  transition: 0.25s ease;
}

.sign-in-btn:hover {
  background: white;
  color: #111;
}


/* Sign Up */

.sign-up-btn {
  border: none;

  background: #20df4f;

  color: #111;

  padding: 13px 24px;

  border-radius: 28px;

  font-size: 15px;

  font-weight: 700;

  cursor: pointer;

  transition: 0.25s ease;
}

.sign-up-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 25px rgba(32, 223, 79, 0.3);
}


/* =========================================
   HERO
========================================= */

/* =========================================
   HERO
========================================= */

.hero {
  position: relative;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
}

/* =========================================
   DARK OVERLAY
========================================= */

.hero-overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.78) 0%,
      rgba(0, 0, 0, 0.48) 35%,
      rgba(0, 0, 0, 0.12) 75%,
      rgba(0, 0, 0, 0.25) 100%
    );

  z-index: 1;
}


/* =========================================
   HERO CONTENT
========================================= */

.hero-content {
  position: relative;

  z-index: 2;

  margin-left: 5.5%;

  margin-top: 30px;
}


.hero-content h1 {
  margin: 0;

  color: white;

  font-size: clamp(55px, 6vw, 90px);

  line-height: 1.05;

  font-weight: 500;

  letter-spacing: -3px;
}


/* =========================================
   GET STARTED BUTTON
========================================= */

.get-started-btn {
  margin-top: 65px;

  width: 290px;
  height: 72px;

  border: none;

  background: white;

  border-radius: 40px;

  padding: 8px 9px 8px 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;

  font-size: 20px;

  font-weight: 600;

  transition: 0.3s ease;
}


.get-started-btn:hover {
  transform: translateY(-3px);
}


/* Arrow */

.arrow-circle {
  width: 55px;
  height: 55px;

  border-radius: 50%;

  background: #20df4f;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  font-size: 30px;

  font-weight: 400;

  transition: 0.3s ease;
}


.get-started-btn:hover .arrow-circle {
  transform: translateX(3px);
}


/* =========================================
   TABLET
========================================= */

@media (max-width: 1000px) {

  .nav-links {
    gap: 20px;
  }

  .nav-links a {
    font-size: 14px;
  }

  .auth-buttons {
    gap: 8px;
  }

  .sign-in-btn,
  .sign-up-btn {
    padding: 10px 16px;
    font-size: 14px;
  }

  .logo-text {
    font-size: 28px;
  }

}


/* =========================================
   MOBILE
========================================= */

@media (max-width: 750px) {

  .navbar {
    height: 75px;

    padding: 0 25px;
  }

  .nav-links {
    display: none;
  }

  .logo-text {
    font-size: 26px;
  }

  .auth-buttons {
    gap: 7px;
  }

  .sign-in-btn,
  .sign-up-btn {
    padding: 9px 13px;

    font-size: 12px;
  }

  .hero {
    min-height: 700px;

    background-position: 65% center;
  }

  .hero-overlay {
    background:
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.82),
        rgba(0, 0, 0, 0.35)
      );
  }

  .hero-content {
    margin-left: 25px;

    margin-right: 25px;
  }

  .hero-content h1 {
    font-size: 52px;

    letter-spacing: -2px;
  }

  .get-started-btn {
    width: 250px;

    height: 65px;

    margin-top: 45px;

    font-size: 18px;
  }

  .arrow-circle {
    width: 49px;
    height: 49px;
  }

}

</style>