import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  // {
  //   displayName: 'Administracion',
  //   iconName: 'mdi:briefcase',
  //   route: '/dashboard/view/administracion',
  //   external: true,
  // },
  {
    displayName: 'Dashboard',
    iconName: 'fa:dashboard',
    route: '/dashboard',
    external: true,
  },

  {
    navCap: 'Stock',
  },

  // {
  //   displayName: 'Estadisticas',
  //   iconName: 'mdi:chart-areaspline',
  //   route: '/dashboard/view/estadisticas',
  //   // chip: true,
  //   external: true,
  //   chipClass: 'bg-secondary text-white',
  //   // chipContent: 'PRO',
  // },


 /*agregar productos*/

 
 /*lista de productos*/
 
 {
   displayName: 'Productos',
    iconName: 'mdi:taxi',
    route: '/dashboard/view/tabla-productos',
    // chip: true,
    external: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
  },
  
  {
    displayName: 'Registrar Productos',
    iconName: 'mdi:plus-circle',
    route: '/dashboard/view/form-producto',
    // chip: true,
    external: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
  },
  
  // {
  //   displayName: 'Ecommerce 2',
  //   iconName: 'solar:shopping-cart-line-duotone',
  //   route: '/dashboard/view/tables',
  //   chip: true,
  //   external: true,
  //   chipClass: 'bg-secondary text-white',
  //   // chipContent: 'PRO',
  // },


 // {
    // divider: true,
    //navCap: 'Taxistas',
  //},
 

  // {
  //   displayName: 'Seleccionar taxistas',
  //   iconName: 'solar:chat-round-line-line-duotone',
  //   route: '/dashboard/view/listado-taxistas',
  //   // chip: true,
  //   external: true,
  //   chipClass: 'bg-secondary text-white',
  //   // chipContent: 'PRO',
  // },
  {
    navCap: 'Ventas',

  },


  {
    displayName: 'Reportes',
    iconName: 'solar:widget-line-duotone',
    route: '/dashboard/view/reporte-ventas',
    // chip: true,
    external: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
  },

  {
    displayName: 'Registrar Venta',
    iconName: 'mdi:cash',
    route: '/dashboard/view/form-ventas',
    // chip: true,
    external: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
  },
  {
    displayName: 'Tabla de Ventas',
    iconName: 'mdi:chart-areaspline',
    // route: 'https://materialm-angular-main.netlify.app/dashboards/dashboard1',
    route: '/dashboard/view/tables',
    // chip: true,

    external: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
    // showView: 'analytics',
  },
  {
    navCap: 'Graficas',
    divider: true,
  },
  {
    displayName: 'Agregar Pedidos',
    iconName: 'mdi:plus-circle',
    route: '/dashboard/view/form-pedidos',
    // chip: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
    external: true,
  },
  {
    displayName: 'Tabla Pedidos',
    iconName: 'mdi:table',
    route: '/dashboard/view/tabla-pedidos',
    // chip: true,
    chipClass: 'bg-secondary text-white',
    // chipContent: 'PRO',
    external: true,
  },




  // {
  //   navCap: 'Listas',
  //   divider: true,
  // },
  // {
  //   displayName: 'Lista de Taxistas',
  //   iconName: 'mdi:format-list-bulleted',
  //   route: '/dashboard/view/lists',
  //   chip: true,
  //   external: true,
  //   chipClass: 'bg-secondary text-white',
  //   // chipContent: 'PRO',
  // },
  // {
  //   displayName: 'Lista de Taxistas 2',
  //   iconName: 'mdi:format-list-bulleted',
  //   route: '/dashboard/view/listado-taxistas',
  //   chip: true,
  //   external: true,
  //   chipClass: 'bg-secondary text-white',
  //   // chipContent: 'PRO',
  // },
  // {
  //   navCap: 'Reportes',
  //   divider: true,
  // },



  // {
  //   divider: true,
  //   displayName: 'Reservas',
  //   // navCap: 'Reservas',
  //   // route: '/dashboard/view/reserva',
  //   children: [


  // ]
  // },



  // {
  //   displayName: 'Blog',
  //   iconName: 'solar:widget-4-line-duotone',
  //   route: 'apps/blog',

  //   chipClass: 'bg-secondary text-white',

  //   children: [
  //     {
  //       displayName: 'Post',
  //       subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: 'https://materialm-angular-main.netlify.app/apps/blog/post',
  //       chip: true,
  //       external: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //     },
  //     {
  //       displayName: 'Detail',
  //       subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: 'https://materialm-angular-main.netlify.app/apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
  //       chip: true,
  //       external: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //     },
  //   ],
  // },

  // {
  //   navCap: 'Ui Components',
  //   divider: true
  // },
  // {
  //   displayName: 'Badge',
  //   iconName: 'solar:archive-minimalistic-line-duotone',
  //   route: '/view/badge', 

  //   chipClass: 'bg-secondary text-white',

  //   external: true,
  // },
  // {
  //   displayName: 'Formulario',
  //   iconName: 'solar:archive-minimalistic-line-duotone',
  //   route: '/view/forms',

  //   chipClass: 'bg-secondary text-white',

  //   external: true,
  // },




  // {
  //   divider: true,
  //   navCap: 'Auth',
  // },
  // {
  //   displayName: 'Side Login',
  //   subItemIcon: true,
  //   iconName: 'solar:round-alt-arrow-right-line-duotone',
  //   route: '/authentication/login',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  // chipContent: 'PRO',

  // {
  //   displayName: 'Login',
  //   iconName: 'solar:lock-keyhole-minimalistic-line-duotone',
  //   route: '/authentication',
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   external: true,
  //   children: [
  //     {
  //       displayName: 'Login',
  //       subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: '/authentication/login',
  //       external: true,
  //     },

  //   ],
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'solar:user-plus-rounded-line-duotone',
  //   route: '/authentication',
  //   children: [
  // {
  //   displayName: 'Register',
  //   subItemIcon: true,
  //   iconName: 'solar:round-alt-arrow-right-line-duotone',
  //   route: '/authentication/register',
  //   external: true,
  // },
  // {
  //   displayName: 'Side Register',
  //    subItemIcon: true,
  //   iconName: 'solar:round-alt-arrow-right-line-duotone',
  //   route: 'https://materialm-angular-main.netlify.app/authentication/side-register',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },
  // ],
  // },

  // {
  //   displayName: 'Boxed Forgot Pwd',
  //    subItemIcon: true,
  //   iconName: 'solar:round-alt-arrow-right-line-duotone',
  //   route: 'https://materialm-angular-main.netlify.app/authentication/boxed-forgot-pwd',
  //   external: true,
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   chipContent: 'PRO',
  // },
  //   ],
  // },
  // {
  //   displayName: 'Two Steps',
  //   iconName: 'solar:siderbar-line-duotone',
  //   route: '/authentication',
  //   chip: true,
  //   chipClass: 'bg-secondary text-white',
  //   // chipContent: 'PRO',
  //   children: [
  //     {
  //       displayName: 'Side Two Steps',
  //        subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: 'https://materialm-angular-main.netlify.app/authentication/side-two-steps',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       chipContent: 'PRO',
  //     },
  //     {
  //       displayName: 'Boxed Two Steps',
  //        subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: 'https://materialm-angular-main.netlify.app/authentication/boxed-two-steps',
  //       external: true,
  //       chip: true,
  //       chipClass: 'bg-secondary text-white',
  //       // chipContent: 'PRO',
  //     },
  //   ],
  // },

];
