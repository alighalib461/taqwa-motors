/**
 * Taqwa Motors - Admin Auth & Layout Controller
 * Enforces session guards and handles user profile display.
 */

let currentUserProfile = null;
let currentSession = null;

async function checkAdminAuth() {
  const supabase = window.getSupabaseClient ? window.getSupabaseClient() : null;
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    // If not logged in and not on login page, redirect to login
    if (!window.location.pathname.includes('login')) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `login.html?return=${returnUrl}`;
    }
    return null;
  }

  currentSession = session;

  // Fetch Profile to verify role
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', session.user.id)
    .single();

  if (profileErr || !profile) {
    console.warn('Profile record not found or inaccessible, using session metadata');
    currentUserProfile = {
      id: session.user.id,
      full_name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
      role: 'owner'
    };
  } else {
    currentUserProfile = profile;
  }

  // Populate sidebar user info
  updateUserUI(currentUserProfile, session.user.email);
  return { session, profile: currentUserProfile };
}

function updateUserUI(profile, email) {
  const nameEl = document.getElementById('sidebarUserName');
  const roleEl = document.getElementById('sidebarUserRole');
  const avatarEl = document.getElementById('sidebarUserAvatar');

  const displayName = profile?.full_name || email || 'Dealership Admin';
  if (nameEl) nameEl.textContent = displayName;
  if (roleEl) roleEl.textContent = profile?.role || 'Owner';
  if (avatarEl) {
    avatarEl.textContent = displayName.charAt(0).toUpperCase();
  }
}

async function handleAdminLogout() {
  const supabase = window.getSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  window.location.href = 'login.html';
}

function initLayoutControls() {
  // Setup clock pill
  const clockEl = document.getElementById('liveClock');
  if (clockEl) {
    const updateTime = () => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' PKT';
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // Mobile sidebar toggle & backdrop handling
  const toggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('adminSidebar');
  
  if (sidebar) {
    let backdrop = document.getElementById('adminSidebarBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'adminSidebarBackdrop';
      backdrop.className = 'admin-sidebar-backdrop';
      document.body.appendChild(backdrop);
    }

    const openSidebar = () => {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      if (window.innerWidth <= 1024) document.body.style.overflow = 'hidden';
    };

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeSidebar);
    }

    // Close on navigation link click on mobile
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) closeSidebar();
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleAdminLogout();
    });
  }
}

// Auto-initialize layout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.includes('login')) {
    checkAdminAuth().then(() => {
      initLayoutControls();
    });
  }
});

window.checkAdminAuth = checkAdminAuth;
window.handleAdminLogout = handleAdminLogout;
window.getCurrentUserProfile = () => currentUserProfile;
window.getCurrentSession = () => currentSession;
