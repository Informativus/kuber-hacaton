import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"

export default async function TablePage({ params }: { params: Promise<{project: string}> }) {
  const { project } = await params
  const data = [
    {
      id: '1',
      name: 'test1',
      status: 'status test1'
    },
    {
      id: '2',
      name: 'test2',
      status: 'status test2'
    },
    {
      id: '3',
      name: 'test3',
      status: 'status test3'
    },
  ]
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Sheet>
                  <SheetTrigger className="cursor-pointer">{item.name}</SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Минон</SheetTitle>
                    </SheetHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Colunm1</TableHead>
                          <TableHead>Column2</TableHead>
                          <TableHead>Column3</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>TEST1</TableCell>
                        <TableCell>TEST2</TableCell>
                        <TableCell><Link href={'/'}>Изменить</Link></TableCell>

                      </TableRow>
                    </TableBody>
                  </Table>
                  </SheetContent>
                </Sheet>
              </TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <Link href={'/'}>Изменить</Link>
              </TableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
