class RateLimiter {
  constructor(maxRequests = 2, timeWindow = 1000, burstCapacity = 40) {
    this.maxRequests = maxRequests; // Maximum requests per time window
    this.timeWindow = timeWindow; // Time window in milliseconds
    this.burstCapacity = burstCapacity; // Maximum burst capacity
    this.tokenBucket = burstCapacity; // Start with a full bucket
    this.lastRefillTime = Date.now();
    this.requestQueue = [];
  }
  
  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefillTime;
    const tokensToAdd = Math.floor(timePassed / this.timeWindow) * this.maxRequests;
    
    if (tokensToAdd > 0) {
      this.tokenBucket = Math.min(this.tokenBucket + tokensToAdd, this.burstCapacity);
      this.lastRefillTime = now;
    }
  }
  
  async acquire() {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        this.refillTokens();
        
        if (this.tokenBucket > 0) {
          this.tokenBucket--;
          resolve();
          
          // Process next request in queue if any
          const nextRequest = this.requestQueue.shift();
          if (nextRequest) {
            setTimeout(nextRequest, 0);
          }
        } else {
          // Add request to queue
          this.requestQueue.push(tryAcquire);
          
          // Schedule next token refill
          setTimeout(() => {
            this.refillTokens();
            
            if (this.tokenBucket > 0 && this.requestQueue.length > 0) {
              const nextRequest = this.requestQueue.shift();
              nextRequest();
            }
          }, this.timeWindow);
        }
      };
      
      tryAcquire();
    });
  }
  
  release() {
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();
module.exports = rateLimiter;