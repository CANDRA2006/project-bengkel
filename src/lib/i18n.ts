// Simple i18n without external libraries
export type Language = 'en' | 'id';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      catalog: 'Catalog',
      booking: 'Booking',
      membership: 'Membership',
      contact: 'Contact',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      admin: 'Admin Panel',
    },
    hero: {
      title: 'Premium Car Service & Modification',
      subtitle: 'Expert maintenance and customization for your vehicle',
      cta: 'Book Now',
    },
    auth: {
      login: 'Sign In',
      register: 'Sign Up',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      whatsapp: 'WhatsApp Number',
      confirmPassword: 'Confirm Password',
      remember: 'Remember me',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      verifyOtp: 'Verify OTP',
      otpSent: 'OTP sent to WhatsApp',
      errors: {
        emailTaken: 'Email already registered. Please login.',
        passwordTooShort: 'Password must be at least 8 characters.',
        invalidPassword: 'Password must be at least 8 characters with no spaces',
        invalidEmail: 'Invalid email address',
        invalidWhatsapp: 'Invalid WhatsApp number',
        passwordMismatch: 'Passwords do not match',
        tooManyAttempts: 'Too many login attempts. Try again in {minutes} minutes.',
        accountLocked: 'Account locked. Try again in {minutes} minutes.',
        invalidCredentials: 'Invalid email or password.',
        invalidOtp: 'Invalid OTP code',
        registrationFailed: 'Registration failed',
      },
      success: {
        registered: 'Account created successfully!',
        loggedIn: 'Welcome, {name}!',
      },
    },
    membership: {
      title: 'Choose Your Plan',
      subtitle: 'Join and enjoy member benefits — faster service, more savings, maximum comfort.',
      monthly: 'Monthly',
      annual: 'Yearly',
      save: 'Save {percent}%',
      plans: {
        basic: {
          name: 'Basic',
          tagline: 'For vehicle owners',
          cta: 'Sign Up Free',
          features: [
            'Online booking',
            'Service history',
            'Service reminders',
            'Product catalog access',
            'WhatsApp support',
          ],
        },
        premium: {
          name: 'Premium',
          tagline: 'Best service experience',
          cta: 'Start Premium',
          features: [
            'All Basic features',
            '15% discount on services',
            'Priority queue (skip waiting)',
            'Free pickup & drop-off (5km radius)',
            'Monthly vehicle health report',
            'Mechanic consultation via WhatsApp',
            'Member-only promos',
            '2× reward points',
          ],
        },
        fleet: {
          name: 'Fleet',
          tagline: 'For business vehicles',
          cta: 'Contact Sales',
          features: [
            'All Premium features',
            'Manage up to 10 vehicles',
            '25% discount on services',
            'Integrated fleet reports',
            'Dedicated account manager',
            'Digital invoices & tax reports',
            '24-hour SLA response',
            'Fleet management API',
          ],
        },
      },
      approvalPending: 'Membership pending approval',
      approved: 'Premium Member',
      requestAccess: 'Request Premium Membership',
    },
    admin: {
      dashboard: 'Admin Dashboard',
      users: 'Users',
      bookings: 'Bookings',
      memberships: 'Memberships',
      statistics: 'Statistics',
      totalUsers: 'Total Users',
      totalBookings: 'Total Bookings',
      pendingMemberships: 'Pending Memberships',
      approve: 'Approve',
      reject: 'Reject',
      status: {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
      },
    },
    common: {
      welcome: 'Welcome',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      language: 'Language',
      logout: 'Logout',
    },
  },
  id: {
    nav: {
      home: 'Beranda',
      services: 'Layanan',
      catalog: 'Katalog',
      booking: 'Booking',
      membership: 'Membership',
      contact: 'Kontak',
      profile: 'Profil',
      login: 'Login',
      register: 'Daftar',
      logout: 'Logout',
      admin: 'Panel Admin',
    },
    hero: {
      title: 'Layanan & Modifikasi Mobil Premium',
      subtitle: 'Perawatan ahli dan kustomisasi untuk kendaraan Anda',
      cta: 'Pesan Sekarang',
    },
    auth: {
      login: 'Masuk',
      register: 'Daftar',
      email: 'Email',
      password: 'Password',
      fullName: 'Nama Lengkap',
      whatsapp: 'Nomor WhatsApp',
      confirmPassword: 'Konfirmasi Password',
      remember: 'Ingat saya',
      forgotPassword: 'Lupa password?',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      verifyOtp: 'Verifikasi OTP',
      otpSent: 'OTP dikirim ke WhatsApp',
      errors: {
        emailTaken: 'Email sudah terdaftar. Silakan login.',
        passwordTooShort: 'Password minimal 8 karakter.',
        invalidPassword: 'Password harus minimal 8 karakter dan tidak mengandung spasi',
        invalidEmail: 'Email tidak valid',
        invalidWhatsapp: 'Nomor WhatsApp tidak valid',
        passwordMismatch: 'Konfirmasi password tidak cocok',
        tooManyAttempts: 'Terlalu banyak percobaan login. Coba lagi dalam {minutes} menit.',
        accountLocked: 'Akun dikunci karena terlalu banyak percobaan. Coba lagi dalam {minutes} menit.',
        invalidCredentials: 'Email atau password salah.',
        invalidOtp: 'Kode OTP salah',
        registrationFailed: 'Pendaftaran gagal',
      },
      success: {
        registered: 'Akun berhasil dibuat!',
        loggedIn: 'Selamat datang, {name}!',
      },
    },
    membership: {
      title: 'Pilih Paket Terbaik',
      subtitle: 'Bergabung dan nikmati keistimewaan member — servis lebih cepat, lebih hemat, lebih nyaman.',
      monthly: 'Bulanan',
      annual: 'Tahunan',
      save: 'Hemat {percent}%',
      plans: {
        basic: {
          name: 'Basic',
          tagline: 'Untuk pemilik kendaraan',
          cta: 'Daftar Gratis',
          features: [
            'Booking servis online',
            'Riwayat perawatan kendaraan',
            'Notifikasi jadwal servis',
            'Akses katalog produk',
            'Dukungan via WhatsApp',
          ],
        },
        premium: {
          name: 'Premium',
          tagline: 'Pengalaman servis terbaik',
          cta: 'Mulai Premium',
          features: [
            'Semua fitur Basic',
            'Diskon 15% semua layanan',
            'Antrean prioritas (skip antri)',
            'Free pick-up & antar (radius 5km)',
            'Laporan kesehatan kendaraan bulanan',
            'Konsultasi mekanik via WhatsApp',
            'Akses member-only promo',
            'Poin reward 2× lebih banyak',
          ],
        },
        fleet: {
          name: 'Fleet',
          tagline: 'Untuk armada bisnis',
          cta: 'Hubungi Sales',
          features: [
            'Semua fitur Premium',
            'Manajemen hingga 10 kendaraan',
            'Diskon 25% semua layanan',
            'Laporan armada terintegrasi',
            'Account manager dedicated',
            'Faktur & laporan pajak digital',
            'SLA 24 jam respons',
            'API integrasi fleet management',
          ],
        },
      },
      approvalPending: 'Membership menunggu persetujuan',
      approved: 'Member Premium',
      requestAccess: 'Ajukan Membership Premium',
    },
    admin: {
      dashboard: 'Dashboard Admin',
      users: 'Pengguna',
      bookings: 'Booking',
      memberships: 'Membership',
      statistics: 'Statistik',
      totalUsers: 'Total Pengguna',
      totalBookings: 'Total Booking',
      pendingMemberships: 'Membership Menunggu',
      approve: 'Setujui',
      reject: 'Tolak',
      status: {
        pending: 'Menunggu',
        approved: 'Disetujui',
        rejected: 'Ditolak',
        confirmed: 'Dikonfirmasi',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
      },
    },
    common: {
      welcome: 'Selamat datang',
      search: 'Cari',
      filter: 'Filter',
      loading: 'Memuat...',
      error: 'Error',
      success: 'Berhasil',
      cancel: 'Batal',
      save: 'Simpan',
      edit: 'Edit',
      delete: 'Hapus',
      back: 'Kembali',
      next: 'Lanjut',
      language: 'Bahasa',
      logout: 'Logout',
    },
  },
};

export function useTranslations(lang: Language) {
  return translations[lang];
}

export function getTranslation(lang: Language, key: string, defaults?: Record<string, string>): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }

  if (typeof value === 'string' && defaults) {
    return value.replace(/\{(\w+)\}/g, (match, placeholder) => defaults[placeholder] || match);
  }

  return typeof value === 'string' ? value : key;
}
