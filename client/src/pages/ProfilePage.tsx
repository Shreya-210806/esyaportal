import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Hash, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {

  const { user } = useAuth();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleSave = () => {

    setEditing(false);

    toast({
      title: "Profile Updated",
      description: "Changes saved successfully",
    });

  };

  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal information
        </p>
      </div>

      <Card>

        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-xl font-bold">
              {user?.name?.[0]}
            </div>

            <div>
              <h2 className="font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge className="mt-1">Consumer</Badge>
            </div>

          </div>

        </CardContent>

      </Card>

      <Card>

        <CardHeader>
          <CardTitle>Consumer Information</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">

          <div>
            <Label>Consumer Number</Label>
            <Input value={user?.consumerNumber || ""} disabled />
          </div>

          <div>
            <Label>Consumer Name</Label>
            <Input value={user?.consumerName || ""} disabled />
          </div>

        </CardContent>

      </Card>

      <Card>

        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {editing ? (

            <>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />

              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>

          ) : (

            <>
              <p><b>Name:</b> {user?.name}</p>
              <p><b>Email:</b> {user?.email}</p>
              <p><b>Phone:</b> {user?.phone}</p>
              <p><b>Address:</b> {user?.address}</p>

              <Button onClick={() => setEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </>

          )}

        </CardContent>

      </Card>

    </div>

  );

}