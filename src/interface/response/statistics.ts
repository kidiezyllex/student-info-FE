export interface IGeneralStatistics {
  homesCount: number;
  guestsCount: number;
  homeOwnersCount: number;
  servicesCount: number;
}

export interface IGeneralStatisticsResponse {
  statusCode: number;
  message: string;
  data: IGeneralStatistics;
}

export interface IRevenueByMonth {
  month: number;
  revenue: number;
}

export interface IRevenueStatistics {
  year: number;
  months: IRevenueByMonth[];
  totalRevenue: number;
}

export interface IRevenueStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IRevenueStatistics;
  };
}

export interface IHomeStatistics {
  totalHomes: number;
  availableHomes: number;
  occupiedHomes: number;
}

export interface IHomeStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IHomeStatistics;
  };
}

export interface IContractStatistics {
  totalContracts: number;
  homeContracts: number;
  serviceContracts: number;
  activeContracts: number;
  expiredContracts: number;
}

export interface IContractStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IContractStatistics;
  };
}

export interface IPaymentStatistics {
  totalPayments: number;
  paidOnTime: number;
  paidLate: number;
  unpaid: number;
}

export interface IPaymentStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IPaymentStatistics;
  };
}

export interface IDuePayment {
  _id: string;
  homeId: {
    name: string;
  };
  guestName: string;
  datePaymentExpec: string;
  totalReceive: number;
  type: number;
  daysUntilDue: number;
}

export interface IDuePaymentsStatistics {
  duePaymentsCount: number;
  duePayments: IDuePayment[];
}

export interface IDuePaymentsStatisticsResponse {
  statusCode: number;
  message: string;
  data: {
    statistics: IDuePaymentsStatistics;
  };
}

// Bar Charts Interfaces
export interface IBarChartData {
  month: string;
  [key: string]: string | number;
}

export interface IChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

export interface IBarChartResponse {
  statusCode: number;
  message: string;
  data: {
    year: number;
    chartData: IBarChartData[];
    config: IChartConfig;
  };
}

// Line Charts Interfaces
export interface ILineChartData {
  month: string;
  [key: string]: string | number;
}

export interface ILineChartResponse {
  statusCode: number;
  message: string;
  data: {
    year: number;
    chartData: ILineChartData[];
    config: IChartConfig;
  };
}

// Pie Charts Interfaces
export interface IPieChartData {
  [key: string]: string | number;
  fill: string;
}

export interface IPieChartResponse {
  statusCode: number;
  message: string;
  data: {
    year?: number;
    chartData: IPieChartData[];
    config: {
      [key: string]: { label: string };
    };
  };
}

// Dashboard Overview Interface
export interface IDashboardOverviewResponse {
  statusCode: number;
  message: string;
  data: {
    year: number;
    overview: {
      general: {
        homesCount: number;
        guestsCount: number;
        homeOwnersCount: number;
        servicesCount: number;
      };
      homes: {
        totalHomes: number;
        rentedHomes: number;
        availableHomes: number;
        rentedPercentage: number;
        availablePercentage: number;
      };
      contracts: {
        totalContracts: number;
        homeContracts: number;
        serviceContracts: number;
        activeHomeContracts: number;
        activeServiceContracts: number;
      };
      payments: {
        totalPayments: number;
        onTimePayments: number;
        latePayments: number;
        onTimePercentage: number;
        latePercentage: number;
      };
    };
    charts: {
      revenueChart: {
        year: number;
        chartData: IBarChartData[];
        config: IChartConfig;
      };
      homesStatusPie: {
        chartData: IPieChartData[];
        config: {
          [key: string]: { label: string };
        };
      };
    };
  };
}

// Homes Rental Status Pie Chart Interface
export interface IHomesRentalStatusData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface IHomesRentalStatusPieResponse {
  statusCode: number;
  message: string;
  data: {
    totalHomes: number;
    chartData: IHomesRentalStatusData[];
  };
}

// Payments Monthly Line Chart Interface
export interface IPaymentsMonthlyData {
  month: number;
  monthName: string;
  totalPayments: number;
  paidPayments: number;
  unpaidPayments: number;
  totalAmount: number;
}

export interface IPaymentsMonthlyResponse {
  statusCode: number;
  message: string;
  data: {
    year: number;
    chartData: IPaymentsMonthlyData[];
    summary: {
      totalPaymentsYear: number;
      totalPaidYear: number;
      totalUnpaidYear: number;
      totalAmountYear: number;
    };
  };
} 