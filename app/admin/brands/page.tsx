import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { requireRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

import { EntityStatusSelect } from "../admin-controls";

export const metadata: Metadata = { title: "브랜드 관리" };

export default async function AdminBrandsPage() {
  await requireRole("admin");

  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("id, brand_name, category, website, status, created_at, brand_contacts(contact_name, contact_phone, contact_wechat)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">브랜드 관리</h1>
        <p className="text-sm text-muted-foreground">{brands?.length ?? 0}개</p>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">브랜드</th>
              <th className="px-4 py-2.5 font-medium">카테고리</th>
              <th className="px-4 py-2.5 font-medium">담당자 (비공개)</th>
              <th className="px-4 py-2.5 font-medium">등록일</th>
              <th className="px-4 py-2.5 font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(brands ?? []).map((b) => {
              const contact = Array.isArray(b.brand_contacts)
                ? b.brand_contacts[0]
                : b.brand_contacts;
              return (
                <tr key={b.id}>
                  <td className="px-4 py-3 font-medium">
                    {b.brand_name ?? "-"}
                    {b.website ? (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="ml-2 text-xs text-muted-foreground underline"
                      >
                        사이트
                      </a>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {b.category ? (
                      <Badge variant="outline">{b.category}</Badge>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {contact?.contact_name ?? "-"}
                    {contact?.contact_phone
                      ? ` · ${contact.contact_phone}`
                      : ""}
                    {contact?.contact_wechat
                      ? ` · ${contact.contact_wechat}`
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(b.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <EntityStatusSelect
                      kind="brand"
                      id={b.id}
                      status={b.status}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
