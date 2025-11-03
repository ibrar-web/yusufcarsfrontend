'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Save, Building2, Bell, Lock, CreditCard } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function SupplierSettingsPage() {
  const [businessName, setBusinessName] = useState('AutoParts Express');
  const [contactName, setContactName] = useState('Sarah Johnson');
  const [email, setEmail] = useState('sarah@autoparts.co.uk');
  const [phone, setPhone] = useState('020 7946 0958');
  const [address, setAddress] = useState('123 Parts Street');
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('SW1A 1AA');
  const [description, setDescription] = useState('Leading supplier of quality car parts in the UK');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [newEnquiryNotif, setNewEnquiryNotif] = useState(true);
  const [quoteAcceptedNotif, setQuoteAcceptedNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Inter'] text-[#0F172A]">Settings</h1>
        <p className="font-['Roboto'] text-[#475569] mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 gap-2">
          <TabsTrigger value="profile" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-['Inter']">Business Information</CardTitle>
              <CardDescription className="font-['Roboto']">
                Update your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="font-['Roboto']">
                    Business Name *
                  </Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="font-['Roboto']"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName" className="font-['Roboto']">
                    Contact Name *
                  </Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="font-['Roboto']"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="font-['Roboto']">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-['Roboto']"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-['Roboto']">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="font-['Roboto']"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="font-['Roboto']">
                  Business Address *
                </Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="font-['Roboto']"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="font-['Roboto']">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="font-['Roboto']"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postcode" className="font-['Roboto']">
                    Postcode *
                  </Label>
                  <Input
                    id="postcode"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="font-['Roboto']"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-['Roboto']">
                  Business Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="font-['Roboto']"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#F02801] hover:bg-[#D22301] text-white"
                  onClick={handleSaveProfile}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-['Inter']">Notification Preferences</CardTitle>
              <CardDescription className="font-['Roboto']">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="space-y-0.5">
                    <Label className="font-['Roboto'] font-medium text-[#0F172A]">
                      Email Notifications
                    </Label>
                    <p className="font-['Roboto'] text-[#475569]">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="space-y-0.5">
                    <Label className="font-['Roboto'] font-medium text-[#0F172A]">
                      SMS Notifications
                    </Label>
                    <p className="font-['Roboto'] text-[#475569]">
                      Receive notifications via text message
                    </p>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-6">
                <h3 className="font-['Inter'] text-[#0F172A] mb-4">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newEnquiry" className="font-['Roboto']">
                      New Enquiries
                    </Label>
                    <Switch
                      id="newEnquiry"
                      checked={newEnquiryNotif}
                      onCheckedChange={setNewEnquiryNotif}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="quoteAccepted" className="font-['Roboto']">
                      Quote Accepted
                    </Label>
                    <Switch
                      id="quoteAccepted"
                      checked={quoteAcceptedNotif}
                      onCheckedChange={setQuoteAcceptedNotif}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="messages" className="font-['Roboto']">
                      New Messages
                    </Label>
                    <Switch
                      id="messages"
                      checked={messageNotif}
                      onCheckedChange={setMessageNotif}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#F02801] hover:bg-[#D22301] text-white"
                  onClick={handleSaveNotifications}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-['Inter']">Change Password</CardTitle>
              <CardDescription className="font-['Roboto']">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="font-['Roboto']">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="font-['Roboto']"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="font-['Roboto']">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  className="font-['Roboto']"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-['Roboto']">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="font-['Roboto']"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-[#F02801] hover:bg-[#D22301] text-white"
                  onClick={handleChangePassword}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-['Inter']">Billing Information</CardTitle>
              <CardDescription className="font-['Roboto']">
                View your subscription and billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg border border-[#E2E8F0] bg-[#F1F5F9]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-['Inter'] text-[#0F172A]">Free Plan</p>
                    <p className="font-['Roboto'] text-[#475569]">
                      Pay per lead only - No monthly fees
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-['Inter'] text-[#0F172A]">£0.00</p>
                    <p className="font-['Roboto'] text-[#475569]">per month</p>
                  </div>
                </div>
                <p className="font-['Roboto'] text-[#475569]">
                  You only pay when customers accept your quotes. No hidden fees.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
