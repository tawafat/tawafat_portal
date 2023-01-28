export interface LocationDetails {
    id?: number;
    name?: string;
    city?: string;
    country?: string;
    address: string;
    long: string;
    lat: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UpdatedBy {
    id: number;
    name: string;
    email: string;
    email_verified_at?: any;
    created_at: Date;
    updated_at: Date;
}

export interface CreatedBy {
    id: number;
    name: string;
    email: string;
    email_verified_at?: any;
    created_at: Date;
    updated_at: Date;
}

export interface Job {
    id?: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    location_id?: number;
    category_slug: string;
    assigned_to_id?: any;
    created_by_id?: number;
    updated_by_id?: number;
    created_at?: Date;
    updated_at?: Date;
    location: LocationDetails;
    category?: Category;
    assigned_to?: Employee;
    updated_by?: UpdatedBy;
    created_by?: CreatedBy;
    complains?: Complain[],
    // radius: string,
}

export interface Category {
    id: number;
    slug: string;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    action: string;
}

export interface Employee {
    id?: number;
    name: string;
    password?: string;
    password_confirmation?: string;
    email?: string;
    email_verified_at?: any;
    created_at?: Date;
    updated_at?: Date;
}

export interface Complain {
    id: number;
    comment: string;
    attachment_id: string;
    attachmentType?: any;
    job_id: string;
    created_by_id: string;
    created_at: Date;
    updated_at: Date;
    attachment_url: string;
    job: Job;
    created_by: CreatedBy;
}

export interface Password{
    old_password: string,
    password: string,
    password_confirmation: string
}

export interface Attachment{
    id: number;
    name: string;
    type: string;
    url: string;
    size: string;
    folder: string;
    note: string;
    description?: any;
    created_by_id: number;
    counter: number;
    created_at: Date;
    updated_at: Date;
}

export interface Pie{
    total: string,
    inactive: string,
    active: string,
    completed: string,
    cancelled: string,
}

export interface Graph{
    dates: Date,
    total: string,
}

export interface Dashboard{
    graph: Graph[],
    pie: Pie,
}
