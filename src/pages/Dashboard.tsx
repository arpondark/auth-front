import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { getProfile, updateProfile, initChangePassword, verifyChangePassword, initChangeEmail, verifyChangeEmail } from '@/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Mail, ShieldCheck, Loader2, CheckCircle2, Lock } from 'lucide-react'

interface UserProfile {
  userId: string
  name: string
  email: string
  isAccountVerified: boolean
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Change Password states
  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordOtpSent, setPasswordOtpSent] = useState(false)

  // Change Email states
  const [changeEmailForm, setChangeEmailForm] = useState({
    newEmail: '',
    password: '',
    otp: '',
  })
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [emailOtpSent, setEmailOtpSent] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getProfile()
      setProfile(data)
      setFormData({
        name: data.name,
        email: data.email,
        password: '',
      })
    } catch (error: any) {
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload: any = { name: formData.name, email: formData.email }
      if (formData.password) {
        payload.password = formData.password
      }

      const updated = await updateProfile(payload)
      setProfile(updated)
      setIsEditing(false)
      setFormData(prev => ({ ...prev, password: '' }))
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    setIsChangingPassword(true)
    try {
      await initChangePassword(changePasswordForm.oldPassword, changePasswordForm.newPassword)
      setPasswordOtpSent(true)
      toast.success('OTP sent to your email')
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate password change')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleVerifyChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    try {
      await verifyChangePassword(changePasswordForm.otp, changePasswordForm.newPassword)
      toast.success('Password changed successfully')
      setPasswordOtpSent(false)
      setChangePasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '', otp: '' })
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleInitChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingEmail(true)
    try {
      await initChangeEmail(changeEmailForm.newEmail, changeEmailForm.password)
      setEmailOtpSent(true)
      toast.success('OTP sent to your new email address')
    } catch (error: any) {
      toast.error(error.message || 'Failed to initiate email change')
    } finally {
      setIsChangingEmail(false)
    }
  }

  const handleVerifyChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingEmail(true)
    try {
      await verifyChangeEmail(changeEmailForm.otp)
      toast.success('Email changed successfully')
      setEmailOtpSent(false)
      setChangeEmailForm({ newEmail: '', password: '', otp: '' })
      // Reload profile to show updated email
      loadProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP')
    } finally {
      setIsChangingEmail(false)
    }
  }

  const resetPasswordForm = () => {
    setPasswordOtpSent(false)
    setChangePasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '', otp: '' })
  }

  const resetEmailForm = () => {
    setEmailOtpSent(false)
    setChangeEmailForm({ newEmail: '', password: '', otp: '' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            {profile?.isAccountVerified ? 'Verified Account' : 'Unverified'}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">User ID</label>
                  <div className="p-2 bg-secondary/50 rounded-md text-xs font-mono text-muted-foreground break-all">
                    {profile?.userId}
                  </div>
                </div>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  required
                />
                {isEditing && (
                  <Input
                    label="New Password (Optional)"
                    type="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isSaving}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>

          {/* Change Password Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password for better security.</CardDescription>
            </CardHeader>
            <form onSubmit={passwordOtpSent ? handleVerifyChangePassword : handleInitChangePassword}>
              <CardContent className="space-y-4">
                {!passwordOtpSent ? (
                  <>
                    <Input
                      label="Current Password"
                      type="password"
                      value={changePasswordForm.oldPassword}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, oldPassword: e.target.value })}
                      required
                    />
                    <Input
                      label="New Password"
                      type="password"
                      value={changePasswordForm.newPassword}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                      required
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={changePasswordForm.confirmPassword}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">
                      Please enter the OTP sent to your email to confirm the password change.
                    </div>
                    <Input
                      label="Enter OTP"
                      type="text"
                      placeholder="123456"
                      value={changePasswordForm.otp}
                      onChange={(e) => setChangePasswordForm({ ...changePasswordForm, otp: e.target.value })}
                      required
                    />
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {passwordOtpSent && (
                  <Button type="button" variant="ghost" onClick={resetPasswordForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" isLoading={isChangingPassword}>
                  {passwordOtpSent ? 'Verify & Change Password' : 'Send OTP'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Change Email Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Change Email
              </CardTitle>
              <CardDescription>Update your email address with verification.</CardDescription>
            </CardHeader>
            <form onSubmit={emailOtpSent ? handleVerifyChangeEmail : handleInitChangeEmail}>
              <CardContent className="space-y-4">
                {!emailOtpSent ? (
                  <>
                    <Input
                      label="New Email Address"
                      type="email"
                      value={changeEmailForm.newEmail}
                      onChange={(e) => setChangeEmailForm({ ...changeEmailForm, newEmail: e.target.value })}
                      required
                    />
                    <Input
                      label="Current Password"
                      type="password"
                      value={changeEmailForm.password}
                      onChange={(e) => setChangeEmailForm({ ...changeEmailForm, password: e.target.value })}
                      required
                    />
                  </>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground mb-4">
                      Please enter the OTP sent to <strong>{changeEmailForm.newEmail}</strong> to confirm the email change.
                    </div>
                    <Input
                      label="Enter OTP"
                      type="text"
                      placeholder="123456"
                      value={changeEmailForm.otp}
                      onChange={(e) => setChangeEmailForm({ ...changeEmailForm, otp: e.target.value })}
                      required
                    />
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {emailOtpSent && (
                  <Button type="button" variant="ghost" onClick={resetEmailForm}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" isLoading={isChangingEmail}>
                  {emailOtpSent ? 'Verify & Change Email' : 'Send OTP'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Account Status Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Overview of your account security and information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.isAccountVerified 
                        ? 'Your email is verified.' 
                        : 'Please verify your email address.'}
                    </p>
                  </div>
                  {profile?.isAccountVerified && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Account Type</p>
                    <p className="text-sm text-muted-foreground">Standard User</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
