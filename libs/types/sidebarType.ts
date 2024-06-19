export type SidebarItem = {
    link: string;
    label: string;
    icon: JSX.Element;
};
  
export type SidebarConfig = {
    blogConfig: SidebarItem[];
    workspaceConfig: SidebarItem[];
    dashboardConfig: SidebarItem[];
};
