"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import * as React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";
import Spinner from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";

export function ProjectList() {
  const [showCreating, setShowCreating] = React.useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  if (!session) {
    router.push("/");
    return;
  }

  const { data: projects, status } = api.project.findAll.useQuery();

  if (status !== "success") {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex items-center pb-4">
        <Button
          variant="outline"
          className="mr-auto"
          onClick={() => setShowCreating(true)}
        >
          Erstellen
        </Button>
      </div>

      {projects && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    <p>
                      Ersteller -{" "}
                      {project.createdBy.displayName ??
                        project.createdBy.userName}
                    </p>
                    <p>Mitglieder - {project.ProjectMember.length}</p>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
