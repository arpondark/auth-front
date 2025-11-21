import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { getProfile, updateProfile } from '@/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { User, Mail, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdate}>
              <CardContent className="space-y-4">
               
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

          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>Overview of your account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
