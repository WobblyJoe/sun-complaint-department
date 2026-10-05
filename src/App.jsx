import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const path = window.location.pathname

  if (path === '/admin') {
    return <AdminPanel />
  }

  if (path === '/track') {
    return <TrackingPage />
  }

  return <PublicSite />
}


/* =========================================================
   PUBLIC SITE
   ========================================================= */

function PublicSite() {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [complaintNumber, setComplaintNumber] = useState('')
  const [publicToken, setPublicToken] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    complaint: '',
    severity: '',
    punishment: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitting(true)
    setSubmitError('')

    const { data, error } = await supabase.rpc('submit_complaint', {
      p_name: formData.name,
      p_complaint: formData.complaint,
      p_severity: formData.severity,
      p_punishment: formData.punishment,
    })

    if (error) {
      console.error('Complaint submission failed:', error)

      setSubmitError(
        'Something went wrong while registering your complaint. Please try again.'
      )

      setSubmitting(false)
      return
    }

    const result = data?.[0]

    if (!result) {
      setSubmitError(
        'The complaint was not registered. Please try again.'
      )

      setSubmitting(false)
      return
    }

    setComplaintNumber(result.complaint_number)
    setPublicToken(result.public_token)

    // Save the private tracking token locally.
    localStorage.setItem(
      'sun_complaint_tracking_token',
      result.public_token
    )

    localStorage.setItem(
      'sun_complaint_number',
      result.complaint_number
    )

    setSubmitted(true)
    setSubmitting(false)
  }

  if (showForm) {
    if (submitted) {
      const trackingUrl =
        `${window.location.origin}/track?token=${publicToken}`

      return (
        <main className="app">
          <div className="background-glow glow-one"></div>
          <div className="background-glow glow-two"></div>

          <section className="department-card confirmation-card">
            <div className="official-bar">
              <span>☀️ CASE MANAGEMENT SYSTEM</span>
              <span>CASE {complaintNumber}</span>
            </div>

            <div className="confirmation-content">
              <div className="success-seal">✓</div>

              <p className="eyebrow">
                DEPARTMENT OF SOLAR MISCONDUCT
              </p>

              <h1>
                COMPLAINT
                <span>REGISTERED</span>
              </h1>

              <p className="confirmation-text">
                {formData.name}'s complaint has been successfully
                registered.
              </p>

              <div className="case-details">
                <div className="detail-row">
                  <span>COMPLAINT ID</span>
                  <strong>{complaintNumber}</strong>
                </div>

                <div className="detail-row">
                  <span>STATUS</span>

                  <strong className="investigation-status">
                    <span></span>
                    UNDER INVESTIGATION
                  </strong>
                </div>

                <div className="detail-row">
                  <span>SEVERITY</span>
                  <strong>{formData.severity}</strong>
                </div>

                <div className="detail-row">
                  <span>ESTIMATED RESOLUTION</span>
                  <strong>10 MINUTES</strong>
                </div>
              </div>

              <div className="investigation-notice">
                <div className="notice-icon">⚖️</div>

                <div>
                  <strong>JAIDEV HAS BEEN NOTIFIED</strong>

                  <p>
                    Please wait while Jaidev personally handles the
                    situation.
                  </p>
                </div>
              </div>

              <div className="sun-warning">
                <span>☀️</span>

                <p>
                  The Sun has been notified of this complaint.
                  <br />
                  It is advised to seek legal representation.
                </p>
              </div>

              <a
                className="track-complaint-button"
                href={trackingUrl}
              >
                TRACK YOUR COMPLAINT
                <span>→</span>
              </a>
            </div>

            <div className="form-footer">
              DEPARTMENT OF SOLAR MISCONDUCT • CASE {complaintNumber} •
              2026
            </div>
          </section>

          <footer>
            Protecting civilians from unnecessary cooking since 2026
          </footer>
        </main>
      )
    }

    return (
      <main className="app">
        <div className="background-glow glow-one"></div>
        <div className="background-glow glow-two"></div>

        <section className="department-card form-card">
          <div className="official-bar">
            <span>☀️ OFFICIAL COMPLAINT FORM</span>
            <span>FORM SC-01</span>
          </div>

          <div className="form-content">
            <button
              className="back-button"
              onClick={() => setShowForm(false)}
              type="button"
            >
              ← BACK TO DEPARTMENT
            </button>

            <div className="form-heading">
              <div className="mini-seal">☀️</div>

              <p className="eyebrow">
                DEPARTMENT OF SOLAR MISCONDUCT
              </p>

              <h1>
                COMPLAINT
                <span>AGAINST THE SUN</span>
              </h1>

              <p className="form-intro">
                Please provide the details of the incident below.
                <br />
                Your complaint will be taken extremely seriously.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-field">
                <label htmlFor="name">
                  NAME / NICKNAME
                  <span>Required</span>
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Cutie"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="complaint">
                  WHAT DID THE SUN DO?
                  <span>Required</span>
                </label>

                <textarea
                  id="complaint"
                  name="complaint"
                  placeholder="Describe the incident..."
                  rows="5"
                  value={formData.complaint}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  HOW BADLY WERE YOU COOKED?
                  <span>Required</span>
                </label>

                <div className="severity-options">
                  <label className="severity-option">
                    <input
                      type="radio"
                      name="severity"
                      value="Mildly cooked"
                      checked={
                        formData.severity === 'Mildly cooked'
                      }
                      onChange={handleChange}
                      required
                    />

                    <span className="severity-box">
                      <strong>01</strong>
                      Mildly cooked
                    </span>
                  </label>

                  <label className="severity-option">
                    <input
                      type="radio"
                      name="severity"
                      value="Quite cooked"
                      checked={
                        formData.severity === 'Quite cooked'
                      }
                      onChange={handleChange}
                    />

                    <span className="severity-box">
                      <strong>02</strong>
                      Quite cooked
                    </span>
                  </label>

                  <label className="severity-option">
                    <input
                      type="radio"
                      name="severity"
                      value="Absolutely cooked"
                      checked={
                        formData.severity === 'Absolutely cooked'
                      }
                      onChange={handleChange}
                    />

                    <span className="severity-box">
                      <strong>03</strong>
                      Absolutely cooked 😭
                    </span>
                  </label>

                  <label className="severity-option">
                    <input
                      type="radio"
                      name="severity"
                      value="CRISPY"
                      checked={formData.severity === 'CRISPY'}
                      onChange={handleChange}
                    />

                    <span className="severity-box">
                      <strong>04</strong>
                      CRISPY ☠️
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="punishment">
                  WHAT PUNISHMENT DOES THE SUN DESERVE?
                  <span>Required</span>
                </label>

                <textarea
                  id="punishment"
                  name="punishment"
                  placeholder="e.g. 30 days without access to Earth..."
                  rows="4"
                  value={formData.punishment}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-warning">
                <span>⚠️</span>

                <p>
                  By submitting this complaint, you authorize Jaidev
                  to personally investigate the alleged solar
                  misconduct.
                </p>
              </div>

              {submitError && (
                <div className="form-error">
                  ⚠️ {submitError}
                </div>
              )}

              <button
                className="submit-button"
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'REGISTERING...'
                  : 'SUBMIT COMPLAINT'}

                <span>🚨</span>
              </button>
            </form>
          </div>

          <div className="form-footer">
            DEPARTMENT OF SOLAR MISCONDUCT • SC-01 • 2026
          </div>
        </section>

        <footer>
          Protecting civilians from unnecessary cooking since 2026
        </footer>
      </main>
    )
  }

  return (
    <main className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <section className="department-card">
        <div className="official-bar">
          <span>☀️ OFFICIAL NOTICE</span>
          <span>CASE SYSTEM • 2026</span>
        </div>

        <div className="card-content">
          <div className="sun-seal">
            <span>☀️</span>
          </div>

          <p className="eyebrow">
            DEPARTMENT OF SOLAR MISCONDUCT
          </p>

          <h1>
            SUN COMPLAINT
            <span>DEPARTMENT</span>
          </h1>

          <div className="divider">
            <span></span>
            <div>☀</div>
            <span></span>
          </div>

          <p className="description">
            Because apparently the Sun has forgotten
            <br />
            basic human rights.
          </p>

          <button
            className="complaint-button"
            onClick={() => setShowForm(true)}
            type="button"
          >
            <span>FILE A COMPLAINT</span>
            <span className="button-icon">🚨</span>
          </button>

          <p className="button-note">
            Complaints are reviewed by the Department of Solar
            Misconduct.
          </p>
        </div>

        <div className="case-notice">
          <div>
            <span className="notice-label">JURISDICTION</span>
            <strong>ALL UNAUTHORIZED COOKING</strong>
          </div>

          <div>
            <span className="notice-label">ESTABLISHED</span>
            <strong>2026</strong>
          </div>

          <div>
            <span className="notice-label">STATUS</span>

            <strong className="status">
              <span className="status-dot"></span>
              ACCEPTING CASES
            </strong>
          </div>
        </div>
      </section>

      <footer>
        Department of Solar Misconduct • Protecting civilians from
        unnecessary cooking since 2026
      </footer>
    </main>
  )
}


/* =========================================================
   TRACKING PAGE
   ========================================================= */

function TrackingPage() {
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [resolvedNotification, setResolvedNotification] =
    useState(false)

  const getToken = () => {
    const params = new URLSearchParams(window.location.search)

    return (
      params.get('token') ||
      localStorage.getItem('sun_complaint_tracking_token')
    )
  }

  const fetchComplaint = async (showLoader = false) => {
    const token = getToken()

    if (!token) {
      setError(
        'No complaint tracking token was found.'
      )
      setLoading(false)
      return
    }

    if (showLoader) {
      setLoading(true)
    }

    const { data, error: fetchError } = await supabase.rpc(
      'get_complaint',
      {
        p_public_token: token,
      }
    )

    if (fetchError) {
      console.error(fetchError)

      setError(
        'Unable to retrieve this complaint.'
      )

      setLoading(false)
      return
    }

    const result = data?.[0]

    if (!result) {
      setError(
        'This complaint could not be found.'
      )

      setLoading(false)
      return
    }

    setComplaint((previous) => {
      if (
        previous &&
        previous.status !== 'resolved' &&
        result.status === 'resolved'
      ) {
        setResolvedNotification(true)

        if (
          'Notification' in window &&
          Notification.permission === 'granted'
        ) {
          new Notification(
            '☀️ SUN COMPLAINT DEPARTMENT',
            {
              body:
                'YOUR CUTIE HAS RESOLVED THE CASE AND DEFEATED THE SUN ☀️',
            }
          )
        }
      }

      return result
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchComplaint(true)

    // Check for status changes every 3 seconds.
    const interval = setInterval(() => {
      fetchComplaint(false)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  if (loading) {
    return (
      <main className="tracking-app">
        <div className="tracking-loading">
          <div>☀️</div>
          <p>ACCESSING CASE FILE...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="tracking-app">
        <section className="tracking-error-card">
          <div className="tracking-seal">⚠️</div>

          <p className="tracking-eyebrow">
            DEPARTMENT OF SOLAR MISCONDUCT
          </p>

          <h1>
            CASE
            <span>NOT FOUND</span>
          </h1>

          <p>{error}</p>

          <a href="/">
            ← RETURN TO DEPARTMENT
          </a>
        </section>
      </main>
    )
  }

  const status = complaint.status

  const isResolved = status === 'resolved'
  const isAccepted = status === 'accepted'

  return (
    <main className="tracking-app">
      {resolvedNotification && (
        <div className="resolution-overlay">
          <div className="resolution-notification">
            <button
              className="notification-close"
              type="button"
              onClick={() =>
                setResolvedNotification(false)
              }
            >
              ×
            </button>

            <div className="notification-sun">
              ☀️
            </div>

            <p>🚨 OFFICIAL DEPARTMENT NOTIFICATION</p>

            <h2>
              YOUR CUTIE HAS
              <span>RESOLVED THE CASE</span>
            </h2>

            <div className="notification-divider">
              ☀
            </div>

            <h3>
              AND DEFEATED THE SUN
            </h3>

            <div className="victory-stamp">
              CASE CLOSED
            </div>
          </div>
        </div>
      )}

      <section className="tracking-card">
        <div className="tracking-top-bar">
          <span>
            ☀️ DEPARTMENT OF SOLAR MISCONDUCT
          </span>

          <span>
            {complaint.complaint_number}
          </span>
        </div>

        <div className="tracking-content">
          <div className="tracking-seal">
            {isResolved ? '🏆' : '☀️'}
          </div>

          <p className="tracking-eyebrow">
            OFFICIAL CASE TRACKER
          </p>

          <h1>
            CASE
            <span>{complaint.complaint_number}</span>
          </h1>

          <p className="tracking-intro">
            Welcome back, {complaint.name}.
            <br />
            The Department is monitoring your case.
          </p>

          <div
            className={`tracking-status-card ${
              isResolved
                ? 'resolved'
                : isAccepted
                  ? 'accepted'
                  : 'investigating'
            }`}
          >
            <div className="tracking-status-icon">
              {isResolved
                ? '✓'
                : isAccepted
                  ? '⚖️'
                  : '🔎'}
            </div>

            <div>
              <span>CURRENT STATUS</span>

              <strong>
                {isResolved
                  ? 'COMPLAINT RESOLVED'
                  : isAccepted
                    ? 'JAIDEV IS HANDLING YOUR COMPLAINT'
                    : 'UNDER INVESTIGATION'}
              </strong>
            </div>
          </div>

          <div className="tracking-progress">
            <div
              className={`tracking-step ${
                status === 'under_investigation' ||
                isAccepted ||
                isResolved
                  ? 'active'
                  : ''
              }`}
            >
              <span>01</span>
              <strong>COMPLAINT FILED</strong>
            </div>

            <div
              className={`tracking-line ${
                isAccepted || isResolved
                  ? 'active'
                  : ''
              }`}
            ></div>

            <div
              className={`tracking-step ${
                isAccepted || isResolved
                  ? 'active'
                  : ''
              }`}
            >
              <span>02</span>
              <strong>JAIDEV HANDLING</strong>
            </div>

            <div
              className={`tracking-line ${
                isResolved
                  ? 'active'
                  : ''
              }`}
            ></div>

            <div
              className={`tracking-step ${
                isResolved
                  ? 'active'
                  : ''
              }`}
            >
              <span>03</span>
              <strong>CASE RESOLVED</strong>
            </div>
          </div>

          <div className="tracking-case-details">
            <div>
              <span>YOUR COMPLAINT</span>
              <p>{complaint.complaint}</p>
            </div>

            <div>
              <span>SEVERITY</span>
              <p>{complaint.severity}</p>
            </div>

            <div>
              <span>REQUESTED PUNISHMENT</span>
              <p>{complaint.punishment}</p>
            </div>
          </div>

          {isResolved && (
            <div className="final-verdict">
              <span>⚖️ OFFICIAL VERDICT</span>

              <strong>
                THE SUN IS GUILTY ☀️
              </strong>

              <p>
                Justice has officially been served.
              </p>
            </div>
          )}

          {!isResolved && (
            <p className="tracking-live-note">
              ● CASE STATUS UPDATES AUTOMATICALLY
            </p>
          )}
        </div>

        <div className="tracking-footer">
          DEPARTMENT OF SOLAR MISCONDUCT • JUSTICE FOR THE COOKED • 2026
        </div>
      </section>
    </main>
  )
}


/* =========================================================
   ADMIN PANEL
   ========================================================= */

function AdminPanel() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [complaints, setComplaints] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()

      if (!mounted) return

      setSession(data.session)
      setLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!mounted) return

        setSession(newSession)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (session) {
      loadComplaints()
    } else {
      setComplaints([])
    }
  }, [session])

  const loadComplaints = async () => {
    setDashboardLoading(true)
    setDashboardError('')

    const { data: adminRecord, error: adminError } =
      await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle()

    if (adminError) {
      console.error(adminError)

      setDashboardError(
        'Unable to verify administrator permissions.'
      )

      setDashboardLoading(false)
      return
    }

    if (!adminRecord) {
      setDashboardError(
        'ACCESS DENIED — This account is not an administrator.'
      )

      setDashboardLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('complaints')
      .select(
        'id, complaint_number, name, complaint, severity, punishment, status, created_at, updated_at'
      )
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error)

      setDashboardError(
        'Unable to load complaints. Please try again.'
      )

      setDashboardLoading(false)
      return
    }

    setComplaints(data || [])
    setDashboardLoading(false)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoginLoading(true)
    setLoginError('')

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      console.error(error)

      setLoginError(
        'Login failed. Check your email and password.'
      )
    }

    setLoginLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const updateComplaintStatus = async (
    complaintId,
    newStatus
  ) => {
    const { error } = await supabase
      .from('complaints')
      .update({
        status: newStatus,
      })
      .eq('id', complaintId)

    if (error) {
      console.error(error)

      setDashboardError(
        'Unable to update the complaint. Please try again.'
      )

      return
    }

    await loadComplaints()
  }

  const getStatusLabel = (status) => {
    if (status === 'accepted') {
      return 'JAIDEV IS HANDLING IT'
    }

    if (status === 'resolved') {
      return 'COMPLAINT RESOLVED'
    }

    return 'UNDER INVESTIGATION'
  }

  const getSeverityClass = (severity) => {
    if (severity === 'CRISPY') {
      return 'admin-severity crispy'
    }

    if (severity === 'Absolutely cooked') {
      return 'admin-severity extreme'
    }

    if (severity === 'Quite cooked') {
      return 'admin-severity high'
    }

    return 'admin-severity mild'
  }

  if (loading) {
    return (
      <main className="admin-app">
        <div className="admin-loading">
          <div className="admin-loader">☀️</div>
          <p>AUTHENTICATING DEPARTMENT ACCESS...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="admin-app">
        <div className="admin-login-card">
          <div className="admin-login-seal">☀️</div>

          <p className="admin-eyebrow">
            DEPARTMENT OF SOLAR MISCONDUCT
          </p>

          <h1>
            ADMIN
            <span>CONTROL CENTER</span>
          </h1>

          <div className="admin-login-divider">
            <span></span>
            <strong>AUTHORIZED PERSONNEL ONLY</strong>
            <span></span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label htmlFor="admin-email">
                ADMIN EMAIL
              </label>

              <input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="admin-password">
                PASSWORD
              </label>

              <input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
              />
            </div>

            {loginError && (
              <div className="admin-error">
                ⚠️ {loginError}
              </div>
            )}

            <button
              className="admin-login-button"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading
                ? 'AUTHENTICATING...'
                : 'ENTER CONTROL CENTER'}

              <span>→</span>
            </button>
          </form>

          <p className="admin-security-note">
            🔐 Restricted to authorized Department personnel.
          </p>

          <button
            className="admin-back-button"
            type="button"
            onClick={() => {
              window.location.href = '/'
            }}
          >
            ← RETURN TO PUBLIC DEPARTMENT
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-app">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">
            DEPARTMENT OF SOLAR MISCONDUCT
          </p>

          <h1>
            CASE <span>CONTROL CENTER</span>
          </h1>
        </div>

        <div className="admin-header-actions">
          <button
            className="admin-refresh-button"
            type="button"
            onClick={loadComplaints}
            disabled={dashboardLoading}
          >
            ↻ REFRESH
          </button>

          <button
            className="admin-logout-button"
            type="button"
            onClick={handleLogout}
          >
            LOG OUT
          </button>
        </div>
      </header>

      <section className="admin-stats">
        <div className="admin-stat">
          <span>TOTAL CASES</span>
          <strong>{complaints.length}</strong>
        </div>

        <div className="admin-stat">
          <span>UNDER INVESTIGATION</span>
          <strong>
            {
              complaints.filter(
                (item) =>
                  item.status === 'under_investigation'
              ).length
            }
          </strong>
        </div>

        <div className="admin-stat">
          <span>BEING HANDLED</span>
          <strong>
            {
              complaints.filter(
                (item) =>
                  item.status === 'accepted'
              ).length
            }
          </strong>
        </div>

        <div className="admin-stat">
          <span>RESOLVED</span>
          <strong>
            {
              complaints.filter(
                (item) =>
                  item.status === 'resolved'
              ).length
            }
          </strong>
        </div>
      </section>

      {dashboardError && (
        <div className="admin-dashboard-error">
          ⚠️ {dashboardError}
        </div>
      )}

      <section className="admin-section-heading">
        <div>
          <p>CASE FILES</p>
          <h2>ACTIVE SOLAR MISCONDUCT REPORTS</h2>
        </div>

        <span>
          {complaints.length}{' '}
          {complaints.length === 1
            ? 'CASE'
            : 'CASES'}
        </span>
      </section>

      {dashboardLoading ? (
        <div className="admin-empty-state">
          <div className="admin-loader">☀️</div>
          <p>RETRIEVING CASE FILES...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="admin-empty-state">
          <div>☀️</div>
          <h3>NO COMPLAINTS FOUND</h3>
          <p>
            The Sun appears to be behaving itself.
            Suspicious.
          </p>
        </div>
      ) : (
        <section className="complaint-list">
          {complaints.map((item) => (
            <article
              className="admin-complaint-card"
              key={item.id}
            >
              <div className="admin-card-top">
                <div>
                  <span className="admin-case-number">
                    {item.complaint_number}
                  </span>

                  <h3>{item.name}</h3>
                </div>

                <span
                  className={getSeverityClass(
                    item.severity
                  )}
                >
                  {item.severity}
                </span>
              </div>

              <div className="admin-card-body">
                <div className="admin-info-block">
                  <span>ALLEGED MISCONDUCT</span>
                  <p>{item.complaint}</p>
                </div>

                <div className="admin-info-block">
                  <span>REQUESTED PUNISHMENT</span>
                  <p>{item.punishment}</p>
                </div>
              </div>

              <div className="admin-card-bottom">
                <div className="admin-current-status">
                  <span
                    className={`admin-status-dot ${item.status}`}
                  ></span>

                  <strong>
                    {getStatusLabel(item.status)}
                  </strong>
                </div>

                <div className="admin-actions">
                  {item.status ===
                    'under_investigation' && (
                    <button
                      className="accept-case-button"
                      type="button"
                      onClick={() =>
                        updateComplaintStatus(
                          item.id,
                          'accepted'
                        )
                      }
                    >
                      🟢 ACCEPT CASE
                    </button>
                  )}

                  {item.status === 'accepted' && (
                    <button
                      className="resolve-case-button"
                      type="button"
                      onClick={() =>
                        updateComplaintStatus(
                          item.id,
                          'resolved'
                        )
                      }
                    >
                      ✅ RESOLVE CASE
                    </button>
                  )}

                  {item.status === 'resolved' && (
                    <div className="resolved-verdict">
                      ☀️ THE SUN HAS BEEN FOUND GUILTY
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-card-footer">
                FILED{' '}
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="admin-footer">
        <span>
          ☀️ DEPARTMENT OF SOLAR MISCONDUCT
        </span>

        <span>
          AUTHORIZED ADMINISTRATOR ACCESS
        </span>
      </footer>
    </main>
  )
}

export default App