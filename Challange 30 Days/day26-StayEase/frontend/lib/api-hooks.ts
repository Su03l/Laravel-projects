'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import type {
    Room, Booking, Review, Package, Service, Amenity,
    SearchFilters, BookingFormData, DashboardStats, PaginatedResponse
} from './types';

export function useRooms(filters?: SearchFilters) {
    return useQuery({
        queryKey: ['rooms', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.check_in) params.append('check_in', filters.check_in);
            if (filters?.check_out) params.append('check_out', filters.check_out);
            if (filters?.type) params.append('type', filters.type);
            if (filters?.view) params.append('view', filters.view);
            if (filters?.min_price) params.append('min_price', String(filters.min_price));
            if (filters?.max_price) params.append('max_price', String(filters.max_price));
            if (filters?.capacity) params.append('capacity', String(filters.capacity));

            const response = await api.get<{ count: number; rooms: Room[] }>(`/rooms/search?${params}`);
            return response.data.rooms || [];
        },
    });
}

export function useRoom(id: number | string) {
    return useQuery({
        queryKey: ['room', id],
        queryFn: async () => {
            const response = await api.get<{ data: Room }>(`/rooms/${id}`);
            return response.data.data || response.data;
        },
        enabled: !!id,
    });
}

export function useRoomReviews(roomId: number | string) {
    return useQuery({
        queryKey: ['room-reviews', roomId],
        queryFn: async () => {
            const response = await api.get<{ data: Review[] }>(`/rooms/${roomId}/reviews`);
            return response.data.data || response.data;
        },
        enabled: !!roomId,
    });
}

export function usePackages() {
    return useQuery({
        queryKey: ['packages'],
        queryFn: async () => {
            const response = await api.get<{ data: Package[] } | Package[]>('/packages');
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        },
    });
}

export function useAmenities() {
    return useQuery({
        queryKey: ['amenities'],
        queryFn: async () => {
            const response = await api.get<{ data: Amenity[] } | Amenity[]>('/amenities');
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        },
    });
}

export function useMyBookings() {
    return useQuery({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const response = await api.get<{ data: Booking[] } | Booking[]>('/my-bookings');
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        },
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: BookingFormData) => {
            const response = await api.post<{ data: Booking }>('/bookings', data);
            return response.data.data || response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookingId: number) => {
            const response = await api.post(`/bookings/${bookingId}/cancel`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
    });
}

export function useFavorites() {
    return useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const response = await api.get<{ data: Room[] } | Room[]>('/favorites');
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        },
    });
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roomId: number) => {
            const response = await api.post('/favorites/toggle', { room_id: roomId });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });
}

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { booking_id: number; rating: number; comment: string }) => {
            const response = await api.post('/reviews', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        },
    });
}

export function useServiceMenu() {
    return useQuery({
        queryKey: ['service-menu'],
        queryFn: async () => {
            const response = await api.get<{ data: Service[] } | Service[]>('/services/menu');
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        },
    });
}

export function useBookingOrders(bookingId: number) {
    return useQuery({
        queryKey: ['booking-orders', bookingId],
        queryFn: async () => {
            const response = await api.get(`/bookings/${bookingId}/orders`);
            return response.data.data || response.data;
        },
        enabled: !!bookingId,
    });
}

export function useOrderService() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { booking_id: number; items: { service_id: number; quantity: number }[] }) => {
            const response = await api.post('/services/order', data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['booking-orders', variables.booking_id] });
        },
    });
}

// ============ PROFILE ============
export function useProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await api.get('/profile');
            return response.data.data || response.data;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name?: string; email?: string; phone?: string; avatar?: File }) => {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.email) formData.append('email', data.email);
            if (data.phone) formData.append('phone', data.phone);
            if (data.avatar) formData.append('avatar', data.avatar);

            const response = await api.post('/profile/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: { current_password: string; new_password: string; new_password_confirmation: string }) => {
            const response = await api.post('/profile/password', {
                current_password: data.current_password,
                new_password: data.new_password,
                new_password_confirmation: data.new_password_confirmation,
            });
            return response.data;
        },
    });
}

export function useToggle2FA() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data?: { enable: boolean }) => {
            const response = await api.post('/profile/2fa', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

// ============ GENERAL ============
export function useContact() {
    return useMutation({
        mutationFn: async (data: { name: string; email: string; subject: string; message: string }) => {
            const response = await api.post('/contact', data);
            return response.data;
        },
    });
}

// ============ ADMIN ============
export function useAdminDashboard() {
    return useQuery({
        queryKey: ['admin-dashboard'],
        queryFn: async () => {
            const response = await api.get<{ data: DashboardStats }>('/admin/dashboard');
            return response.data.data || response.data;
        },
    });
}

export function useAdminBookings(filters?: { status?: string }) {
    return useQuery({
        queryKey: ['admin-bookings', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.status) params.append('status', filters.status);
            const response = await api.get<{ data: Booking[] } | Booking[]>(`/admin/bookings?${params}`);
            return Array.isArray(response.data) ? response.data : (response.data.data || []);
        },
    });
}

export function useUpdateBookingStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ bookingId, status }: { bookingId: number; status: string }) => {
            const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        },
    });
}

export function useUpdateRoomStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ roomId, status }: { roomId: number; status: string }) => {
            const response = await api.put(`/admin/rooms/${roomId}/status`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
        },
    });
}
