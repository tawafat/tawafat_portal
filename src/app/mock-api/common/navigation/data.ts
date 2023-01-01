/* eslint-disable */
import {FuseNavigationItem} from '@fuse/components/navigation';

export const compactNavigation: FuseNavigationItem[] =
    [
        {
            id: 'home',
            title: 'الرئيسية',
            tooltip: 'الرئيسية',
            type: 'basic',
            icon: 'mat_solid:space_dashboard',
            link: '/home'
        },
        {
            id: 'jobs',
            title: 'المهام',
            tooltip: 'المهام',
            type: 'basic',
            icon: 'mat_outline:work',
            link: '/jobs'
        },
        {
            id: 'employees',
            title: 'الموظفين',
            tooltip: 'الموظفين',
            type: 'basic',
            icon: 'heroicons_solid:users',
            link: '/employees'
        },
        {
            id: 'settings',
            title: 'التصنيفات',
            tooltip: 'التصنيفات',
            type: 'basic',
            icon: 'mat_solid:category',
            link: '/settings'
        },
    ];
export const defaultNavigation: FuseNavigationItem[] = compactNavigation;
