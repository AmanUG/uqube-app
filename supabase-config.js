// U'Qube Supabase Configuration
const SUPABASE_URL = 'https://cbjbwzwgembwimagmgdq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UNsde0jXxzNjgikyUNRhNg_gVoBGggX';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is already logged in
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    // User is logged in, redirect to dashboard
    window.location.href = '/dashboard.html';
  }
}

// Run auth check on page load (except on dashboard)
if (!window.location.pathname.includes('dashboard')) {
  checkAuth();
}

// Sign Up Function
async function createAccount() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
  const address = document.getElementById('signupAddress').value;
  const phone = document.getElementById('signupPhone').value;

  // Validation
  if (!name || !email || !password || !address) {
    alert('Please fill in all required fields');
    return;
  }

  if (password !== passwordConfirm) {
    alert('Passwords do not match');
    return;
  }

  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  try {
    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name,
          phone: phone,
          address: address
        }
      }
    });

    if (error) throw error;

    // Success
    alert('Account created successfully! Redirecting to dashboard...');
    window.location.href = '/dashboard.html';

  } catch (error) {
    console.error('Signup error:', error);
    alert('Error creating account: ' + error.message);
  }
}

// Login Function
async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    // Success
    window.location.href = '/dashboard.html';

  } catch (error) {
    console.error('Login error:', error);
    alert('Error signing in: ' + error.message);
  }
}

// Logout Function
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    window.location.href = '/index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error logging out: ' + error.message);
  }
}

// Get current user
async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = '/index.html';
    return null;
  }
  return session.user;
}

// Get user profile
async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}
