import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BrokerPaginationProps {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
}

const BrokerPagination: React.FC<BrokerPaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  if (pagination.totalPages <= 1) return null;

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.pageBtn,
          !pagination.hasPrevPage && styles.pageBtnDisabled,
        ]}
        disabled={!pagination.hasPrevPage}
        onPress={() => onPageChange(pagination.currentPage - 1)}
      >
        <Text
          style={[
            styles.pageBtnText,
            !pagination.hasPrevPage && styles.pageBtnTextDisabled,
          ]}
        >
          Previous
        </Text>
      </TouchableOpacity>

      <View style={styles.pageNumbers}>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
          .filter(p => {
            const current = pagination.currentPage;
            return (
              p === 1 ||
              p === pagination.totalPages ||
              (p >= current - 1 && p <= current + 1)
            );
          })
          .map((p, i, arr) => {
            const isFirst = i === 0;
            const prev = arr[i - 1];
            const showEllipsis = !isFirst && p - prev > 1;

            return (
              <React.Fragment key={p}>
                {showEllipsis && (
                  <Text style={styles.paginationEllipsis}>...</Text>
                )}
                <TouchableOpacity
                  style={[
                    styles.pageNumberBtn,
                    pagination.currentPage === p && styles.activePageNumberBtn,
                  ]}
                  onPress={() => onPageChange(p)}
                >
                  <Text
                    style={[
                      styles.pageNumberText,
                      pagination.currentPage === p &&
                        styles.activePageNumberText,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
      </View>

      <TouchableOpacity
        style={[
          styles.pageBtn,
          !pagination.hasNextPage && styles.pageBtnDisabled,
        ]}
        disabled={!pagination.hasNextPage}
        onPress={() => onPageChange(pagination.currentPage + 1)}
      >
        <Text
          style={[
            styles.pageBtnText,
            !pagination.hasNextPage && styles.pageBtnTextDisabled,
          ]}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    gap: 12,
  },
  pageBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  pageBtnDisabled: {
    backgroundColor: '#f9f9f9',
    borderColor: '#f0f0f0',
  },
  pageBtnText: {
    color: '#EE2529',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pageBtnTextDisabled: {
    color: '#ccc',
  },
  pageNumbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageNumberBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  activePageNumberBtn: {
    backgroundColor: '#EE2529',
    borderColor: '#EE2529',
  },
  pageNumberText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  activePageNumberText: {
    color: '#fff',
  },
  paginationEllipsis: {
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 4,
  },
});

export default BrokerPagination;
