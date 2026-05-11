import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button, Input } from "@base-ui/react";

const Profile = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col justify-center items-center bg-gray-100 py-8">
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>
            <div className="w-full flex flex-col md:flex-row gap-10 justify-center items-start px-7 max-w-3xl">
              {/* profile picture */}
              <div className="flex flex-col items-center md:pt-6">
                <img
                  src="/MyImg.png"
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                />
                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-center">
                  Change Picture
                  <input type="file" accept="image/*" className="hidden" />
                </Label>
              </div>

              {/* profile form */}
              <form className="flex-1 space-y-4 shadow-lg p-6 rounded-xl bg-white w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium mb-1">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium mb-1">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="hello@gmail.com"
                    disabled
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">
                    Phone Number
                  </Label>
                  <Input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter your Contact Number"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-1">
                    Address
                  </Label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter your Address"
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium mb-1">
                      City
                    </Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter your City"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium mb-1">
                      Zip Code
                    </Label>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="Enter your Zip Code"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded-lg"
                >
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>
        {/* 
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Track performance and user engagement metrics. Monitor trends
                and identify growth opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Page views are up 25% compared to last month.
            </CardContent>
          </Card>
        </TabsContent> */}
        
      </Tabs>
    </div>
  );
};

export default Profile;
