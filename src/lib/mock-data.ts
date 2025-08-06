// Mock data for when backend is not available
import type { DashboardStats, Operation, Pensioner } from './api'

export const mockDashboardStats: DashboardStats = {
  totalPensioners: 1247,
  pensionersByCity: [
    ['Casablanca', 423],
    ['Rabat', 312],
    ['Marrakech', 198],
    ['Fès', 156],
    ['Tanger', 89],
    ['Agadir', 69]
  ],
  pensionersByPaymentMethod: [
    ['BANK_TRANSFER', 856],
    ['CHECK', 234],
    ['CASH', 98],
    ['DIGITAL_WALLET', 59]
  ],
  totalOperations: 3456
}

export const mockRecentOperations: Operation[] = [
  {
    id: 1,
    pensionerId: 1001,
    amount: 3500,
    type: 'PAYMENT',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    description: 'Pension mensuelle - Janvier 2024',
    pensioner: {
      id: 1001,
      name: 'Ahmed Benali',
      city: 'Casablanca',
      monthlyPayment: 3500,
      paymentMethod: 'BANK_TRANSFER'
    }
  },
  {
    id: 2,
    pensionerId: 1002,
    amount: 2800,
    type: 'PAYMENT',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    description: 'Pension mensuelle - Janvier 2024',
    pensioner: {
      id: 1002,
      name: 'Fatima Alaoui',
      city: 'Rabat',
      monthlyPayment: 2800,
      paymentMethod: 'CHECK'
    }
  },
  {
    id: 3,
    pensionerId: 1003,
    amount: 500,
    type: 'BONUS',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    description: 'Prime exceptionnelle',
    pensioner: {
      id: 1003,
      name: 'Mohamed Tazi',
      city: 'Marrakech',
      monthlyPayment: 4200,
      paymentMethod: 'BANK_TRANSFER'
    }
  },
  {
    id: 4,
    pensionerId: 1004,
    amount: 150,
    type: 'DEDUCTION',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    description: 'Correction - Trop-perçu',
    pensioner: {
      id: 1004,
      name: 'Aicha Benjelloun',
      city: 'Fès',
      monthlyPayment: 3100,
      paymentMethod: 'BANK_TRANSFER'
    }
  },
  {
    id: 5,
    pensionerId: 1005,
    amount: 3900,
    type: 'PAYMENT',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    description: 'Pension mensuelle - Janvier 2024',
    pensioner: {
      id: 1005,
      name: 'Hassan Idrissi',
      city: 'Tanger',
      monthlyPayment: 3900,
      paymentMethod: 'DIGITAL_WALLET'
    }
  }
]

export const mockMonthlyPayments = [
  { month: 'Jan', amount: 4250000 },
  { month: 'Fév', amount: 4180000 },
  { month: 'Mar', amount: 4320000 },
  { month: 'Avr', amount: 4290000 },
  { month: 'Mai', amount: 4410000 },
  { month: 'Jun', amount: 4380000 },
  { month: 'Jul', amount: 4520000 },
  { month: 'Aoû', amount: 4480000 },
  { month: 'Sep', amount: 4350000 },
  { month: 'Oct', amount: 4420000 },
  { month: 'Nov', amount: 4390000 },
  { month: 'Déc', amount: 4650000 }
]