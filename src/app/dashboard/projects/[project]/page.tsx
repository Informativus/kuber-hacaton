import React from "react";

export default async function Project({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;

  return <div>{project}</div>;
}
