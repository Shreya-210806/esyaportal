import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Zap, MapPin, Hash } from "lucide-react";

export default function ConsumersPage() {

  const { user } = useAuth();

  return (

    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">My Consumers</h1>
        <p className="text-muted-foreground text-sm">
          Manage electricity connections
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-lg font-bold">1</p>
              <p className="text-xs text-muted-foreground">Total Connections</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-lg font-bold">1</p>
              <p className="text-xs text-muted-foreground">Active Meter</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Hash className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-lg font-bold">1</p>
              <p className="text-xs text-muted-foreground">Connection Type</p>
            </div>
          </CardContent>
        </Card>

      </div>

      <Card>

        <CardContent className="p-6">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold">{user?.consumerName}</h3>

            <Badge>Residential</Badge>

          </div>

          <div className="space-y-2 text-sm">

            <p className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              {user?.consumerNumber}
            </p>

            <p className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Meter: MTR607355
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {user?.address}
            </p>

          </div>

        </CardContent>

      </Card>

    </div>

  );

}