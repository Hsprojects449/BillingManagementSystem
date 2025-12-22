"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"

interface Organization {
  id: string
  name: string
}

interface UserFormProps {
  organizations: Organization[]
  initialData?: {
    id: string
    email: string
    full_name: string
    role: string
    organization_id: string
    is_active: boolean
  }
}

export function UserForm({ organizations, initialData }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    full_name: initialData?.full_name || "",
    password: "",
    role: initialData?.role || "accountant",
    organization_id: initialData?.organization_id || "",
    is_active: initialData?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    try {
      if (initialData) {
        // Update existing user
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: formData.full_name,
            role: formData.role,
            organization_id: formData.organization_id,
            is_active: formData.is_active,
          })
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        // Create new user - Note: This requires super admin privileges
        // In production, you'd typically use a server action or admin API
        alert(
          "Creating new users requires backend admin API. For now, users should sign up via the signup page and then be assigned roles by super admin.",
        )
        router.push("/dashboard/users")
        return
      }

      router.push("/dashboard/users")
      router.refresh()
    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg border border-slate-200">
      <div className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!!initialData}
            required
          />
        </div>

        {!initialData && (
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>
        )}

        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="organization_id">Organization</Label>
          <Select
            value={formData.organization_id}
            onValueChange={(value) => setFormData({ ...formData, organization_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select organization" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {initialData && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update User" : "Create User"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/users")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
