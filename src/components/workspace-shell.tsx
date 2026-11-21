import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  Command,
  Menu,
  Moon,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { navGroups, sampleApprovals } from "@/lib/workspace-data";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const currentPath = useRouterState({ select: (router) => router.location.pathname });
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("opencrewbot-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("opencrewbot-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const items = useMemo(() => navGroups.flatMap((group) => group.items), []);
  const searchResults = items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
  const activeItem = items.find((item) => item.href === currentPath);

  const navContent = (
    <>
      <div className={cn("flex h-[72px] items-center border-b border-sidebar-border px-4", collapsed && "md:justify-center md:px-0")}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Bot className="size-5" aria-hidden="true" />
          </div>
          <div className={cn("min-w-0", collapsed && "md:hidden")}>
            <p className="truncate text-sm font-semibold text-sidebar-foreground">OpenCrewBot</p>
            <p className="text-xs text-sidebar-foreground/65">WORKFORCE · 2.0</p>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="ml-auto size-8 text-sidebar-foreground md:hidden"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div className="mb-5" key={group.label}>
            <p className={cn("mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/55", collapsed && "md:sr-only")}>
              {group.label}
            </p>
            <nav aria-label={group.label} className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = currentPath === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={collapsed ? item.label : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-md px-2.5 text-[13px] font-medium transition-colors",
                      collapsed && "md:justify-center md:px-0",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-[17px] shrink-0" aria-hidden="true" />
                    <span className={cn("truncate", collapsed && "md:hidden")}>{item.label}</span>
                    {item.key === "approvals" && (
                      <span className={cn("ml-auto flex size-5 items-center justify-center rounded-full bg-warning/15 text-[10px] font-semibold text-warning-foreground", collapsed && "md:hidden")}>
                        {sampleApprovals.length}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className={cn("border-t border-sidebar-border p-3", collapsed && "md:px-2")}>
        <div className={cn("flex items-center gap-3 rounded-md bg-sidebar-accent/70 p-2.5", collapsed && "md:justify-center md:p-2")}>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">AC</div>
          <div className={cn("min-w-0 flex-1", collapsed && "md:hidden")}>
            <p className="truncate text-xs font-semibold text-sidebar-foreground">Admin Console</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">Workspace owner</p>
          </div>
          <Settings2 className={cn("size-4 text-sidebar-foreground/55", collapsed && "md:hidden")} aria-hidden="true" />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {mobileOpen && (
        <button
          className="fixed inset-0 z-30 bg-foreground/30 md:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width,transform] duration-200 md:static md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {navContent}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 md:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden size-9 shrink-0 md:inline-flex"
              aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
              title={collapsed ? "Expand navigation" : "Collapse navigation"}
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
            <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground sm:flex">
              <span>Workspace</span>
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <span className="truncate font-medium text-foreground">{activeItem?.label ?? "Overview"}</span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Badge variant="outline" className="mr-1 hidden border-warning/30 bg-warning/10 text-warning-foreground sm:inline-flex">
                <span className="mr-1.5 size-1.5 rounded-full bg-warning" />
                Demo mode
              </Badge>
              <Button
                type="button"
                variant="outline"
                className="h-9 w-9 px-0 sm:w-52 sm:justify-start sm:px-3"
                aria-label="Search workspace"
                onClick={() => setSearchOpen(true)}
              >
                <Search />
                <span className="hidden text-muted-foreground sm:inline">Search workspace</span>
                <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">⌘ K</kbd>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative size-9"
                aria-label="Open notifications"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-warning ring-2 ring-background" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
                onClick={() => setDark((value) => !value)}
              >
                {dark ? <Sun /> : <Moon />}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border/70 bg-warning/5 px-4 py-2 text-xs text-muted-foreground sm:px-6 lg:px-8">
            <Command className="size-3.5 shrink-0 text-warning-foreground" aria-hidden="true" />
            <span>Preview workspace · actions and figures are illustrative; no agents or integrations are connected.</span>
            <Link to="/approvals" className="ml-auto hidden shrink-0 font-medium text-primary hover:underline sm:inline-flex">
              <ShieldCheck className="mr-1.5 size-3.5" />
              {sampleApprovals.length} approval previews
            </Link>
          </div>
        </header>

        <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1500px]">{children}</div>
        </main>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[18%] translate-y-0 gap-3 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Search workspace</DialogTitle>
            <DialogDescription>Jump to a workspace area.</DialogDescription>
          </DialogHeader>
          <Input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search pages…" aria-label="Search pages" />
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {searchResults.length ? searchResults.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => { setSearchOpen(false); setSearch(""); }}
                  className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm hover:bg-accent"
                >
                  <Icon className="size-4 text-muted-foreground" />
                  {item.label}
                  <ChevronRight className="ml-auto size-4 text-muted-foreground" />
                </Link>
              );
            }) : <p className="px-3 py-5 text-center text-sm text-muted-foreground">No matching areas.</p>}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Review queue</DialogTitle>
            <DialogDescription>Illustrative requests only. No action has been sent to an external service.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {sampleApprovals.map((approval) => (
              <div className="rounded-md border border-border p-3" key={approval.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{approval.action}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{approval.agent} · {approval.service}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 border-warning/30 bg-warning/10 text-warning-foreground">Preview</Badge>
                </div>
              </div>
            ))}
            <Link to="/approvals" onClick={() => setNotificationsOpen(false)} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
              Open approval centre <ChevronRight className="ml-1 size-4" />
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}