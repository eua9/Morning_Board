//
//  APIService.swift
//  MorningBoard
//
//  Created on $(date).
//  Copyright © 2024 MorningBoard. All rights reserved.
//

import Foundation

/// API Service for making HTTP requests to the backend
class APIService {
    // MARK: - Constants
    
    private static let baseURL = "http://localhost:3000"
    private static let timeoutInterval: TimeInterval = 30.0
    
    // MARK: - Add Account
    
    /// Add a new bank account
    /// - Parameters:
    ///   - request: The account request data
    ///   - completion: Completion handler with result
    static func addAccount(
        request: AddAccountRequest,
        completion: @escaping (Result<AddAccountResponse, APIError>) -> Void
    ) {
        // Get access token
        guard let accessToken = TokenStorage.getAccessToken() else {
            completion(.failure(.unauthorized("No access token found")))
            return
        }
        
        // Build URL
        guard let url = URL(string: "\(baseURL)/api/accounts") else {
            completion(.failure(.invalidURL))
            return
        }
        
        // Create request
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        urlRequest.timeoutInterval = timeoutInterval
        
        // Encode request body
        do {
            let encoder = JSONEncoder()
            // Use default camelCase encoding to match backend API
            urlRequest.httpBody = try encoder.encode(request)
        } catch {
            completion(.failure(.encodingError(error.localizedDescription)))
            return
        }
        
        // Perform request
        URLSession.shared.dataTask(with: urlRequest) { data, response, error in
            // Handle network error
            if let error = error {
                completion(.failure(.networkError(error.localizedDescription)))
                return
            }
            
            // Handle HTTP response
            guard let httpResponse = response as? HTTPURLResponse else {
                completion(.failure(.invalidResponse))
                return
            }
            
            // Handle response data
            guard let data = data else {
                completion(.failure(.noData))
                return
            }
            
            // Handle status codes
            switch httpResponse.statusCode {
            case 201:
                // Success - decode response
                do {
                    let decoder = JSONDecoder()
                    // Use default camelCase decoding to match backend API
                    let response = try decoder.decode(AddAccountResponse.self, from: data)
                    completion(.success(response))
                } catch {
                    completion(.failure(.decodingError(error.localizedDescription)))
                }
            case 400:
                // Bad Request - try to decode error message
                if let errorMessage = try? JSONDecoder().decode(APIErrorMessage.self, from: data) {
                    completion(.failure(.badRequest(errorMessage.error)))
                } else {
                    completion(.failure(.badRequest("Validation failed")))
                }
            case 401:
                completion(.failure(.unauthorized("Authentication required")))
            case 403:
                completion(.failure(.forbidden("Access denied")))
            case 404:
                completion(.failure(.notFound("Resource not found")))
            case 500...599:
                // Server error - try to decode error message
                if let errorMessage = try? JSONDecoder().decode(APIErrorMessage.self, from: data) {
                    completion(.failure(.serverError(errorMessage.error)))
                } else {
                    completion(.failure(.serverError("Server error occurred")))
                }
            default:
                completion(.failure(.unknownError("Unexpected status code: \(httpResponse.statusCode)")))
            }
        }.resume()
    }
}

// MARK: - API Error Types

/// API Error enumeration
enum APIError: Error, LocalizedError {
    case invalidURL
    case networkError(String)
    case invalidResponse
    case noData
    case encodingError(String)
    case decodingError(String)
    case badRequest(String)
    case unauthorized(String)
    case forbidden(String)
    case notFound(String)
    case serverError(String)
    case unknownError(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .networkError(let message):
            return "Network error: \(message)"
        case .invalidResponse:
            return "Invalid response"
        case .noData:
            return "No data received"
        case .encodingError(let message):
            return "Encoding error: \(message)"
        case .decodingError(let message):
            return "Decoding error: \(message)"
        case .badRequest(let message):
            return message
        case .unauthorized(let message):
            return message
        case .forbidden(let message):
            return message
        case .notFound(let message):
            return message
        case .serverError(let message):
            return "Server error: \(message)"
        case .unknownError(let message):
            return message
        }
    }
}

/// Error message response from API
struct APIErrorMessage: Codable {
    let message: String
    let error: String
}

