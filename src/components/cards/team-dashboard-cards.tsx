import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import React from "react";

type ComponentProps = {
  openProcessCount: number;
  memberCount: number;
  templateCount: number;
};

export function TeamDashboardCardsComponent({
  openProcessCount,
  memberCount,
  templateCount,
}: ComponentProps) {
  return (
    <div className={"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"}>
      <Card className={"w-full"}>
        <CardHeader className={"relative"}>
          <CardDescription>Offene Prozesse</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {openProcessCount}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className={"w-full"}>
        <CardHeader className={"relative"}>
          <CardDescription>Mitglieder</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {memberCount}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className={"w-full"}>
        <CardHeader className={"relative"}>
          <CardDescription>Vorlagen</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {templateCount}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
