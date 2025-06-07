import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import apiDash from "@/services/apiDash";

interface Cluster {
  "id": number,
  "projectId": number,
  "ip": string,
  "username": string,
  "type": string,
  "createdAt": string,
  "joinCommand": null,
  "token": null,
  "caCertHash": null
}

async function getClusters (projectId: string) {
  try{
    const result = await apiDash.post<Cluster[]>('k8s/project/clusterlist', {
      projectId
    })
    return result.data
  } catch (e) {
    console.log(e)
    return [
      {
        id: 1,
        projectId: projectId,
        ip: 'ip 13213123',
        username: 'username',
        type: 'type1',
        createdAt: 'time'
      },
      {
        id: 2,
        projectId: projectId,
        ip: 'ip 4384234820349',
        username: 'username 2',
        type: 'type2',
        createdAt: 'time'
      }
    ]
  }
}

export default async function TablePage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  const data = await getClusters(project)

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Проекты {project}
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <Table className="min-w-full text-sm text-gray-700">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-5 py-3 text-left font-medium uppercase tracking-wide">
                Ip
              </TableHead>
              <TableHead className="px-5 py-3 text-left font-medium uppercase tracking-wide">
                Имя пользвателя
              </TableHead>
              <TableHead className="px-5 py-3 text-left font-medium uppercase tracking-wide">
                Тип
              </TableHead>
              <TableHead className="px-5 py-3" />
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200">
            {data.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-5 py-3">
                  <Sheet>
                    <SheetTrigger className="text-gray-800 hover:text-gray-600 cursor-pointer underline">
                      {item.ip}
                    </SheetTrigger>

                    <SheetContent className="w-full max-w-md bg-white rounded-lg shadow-lg p-5">
                      <SheetHeader className="border-b border-gray-200 mb-4 pb-2">
                        <SheetTitle className="text-lg font-semibold text-gray-900">
                          Details for {item.id}
                        </SheetTitle>
                      </SheetHeader>

                      <Table className="w-full text-sm text-gray-700">
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead className="px-4 py-2 text-left font-medium">
                              Column1
                            </TableHead>
                            <TableHead className="px-4 py-2 text-left font-medium">
                              Column2
                            </TableHead>
                            <TableHead className="px-4 py-2" />
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200">
                          <TableRow className="hover:bg-gray-50">
                            <TableCell className="px-4 py-2">TEST1</TableCell>
                            <TableCell className="px-4 py-2">TEST2</TableCell>
                            <TableCell className="px-4 py-2">
                              <Link
                                href="/"
                                className="text-gray-800 hover:underline"
                              >
                                Изменить
                              </Link>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </SheetContent>
                  </Sheet>
                </TableCell>

                <TableCell className="px-5 py-3">{item.username}</TableCell>
                <TableCell className="px-5 py-3">{item.type}</TableCell>

                <TableCell className="px-5 py-3">
                  <Link href={`/dashboard/projects/${project}/${item.id}`} className="text-gray-800 hover:underline">
                    Изменить
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
